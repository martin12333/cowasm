# See https://dev.to/dangerontheranger/dependency-injection-with-import-hooks-in-python-3-5hap

import importlib
import importlib.abc
import sys
import tempfile
import zipfile
import tarfile
from time import time

# Some hardcoded values for testing right now.  These will get filled in at startup
# by something aware of what modules are installed and where.
# This is very stupid and will be gone soon, of course.
for packages in sys.path:
    if packages.endswith("python311.zip"):
        i = packages.rfind("/cpython/")
        packages = packages[:i]
        break

zython_modules = {
    'mpmath': packages + '/py-mpmath/dist/wasm/mpmath.zip',
    'sympy': packages + '/py-sympy/dist/wasm/sympy.zip',
    'numpy': packages + '/py-numpy/dist/wasm/numpy.zip',
    #'cython': packages + '/py-cython/dist/wasm/cython.zip'
}

zython_modules_0 = {
    'mpmath': packages + '/py-mpmath/dist/wasm/mpmath.tar.xz',
    'sympy': packages + '/py-sympy/dist/wasm/sympy.tar.xz',
    'numpy': packages + '/py-numpy/dist/wasm/numpy.tar.xz',
    'cython': packages + '/py-cython/dist/wasm/cython.tar.xz',
}

verbose = False

class ZythonPackageFinder(importlib.abc.MetaPathFinder):

    def __init__(self, loader):
        self._loader = loader

    def find_spec(self, fullname, path, target=None):
        """
        - fullname is the fully-qualified name of the module,
        - path is set to __path__ for sub-modules/packages, or None otherwise.
        - target can be a module object, but is unused in this example.
        """
        if self._loader.provides(fullname):
            return self._gen_spec(fullname)

    def _gen_spec(self, fullname):
        spec = importlib.machinery.ModuleSpec(fullname, self._loader)
        return spec


class ZythonPackageLoader(importlib.abc.Loader):

    def __init__(self):
        self._creating = set([])

    def provides(self, fullname):
        name = fullname.split('.')[0]
        # important to not say we provide package *while loading it*, since
        # during the load we switch to creating something else to provide it.
        return name not in self._creating and \
                zython_modules.get(name) is not None

    def create_module(self, spec):
        if verbose: print("create_module", spec)
        name = spec.name.split('.')[0]
        path = zython_modules.get(name)
        try:
            self._creating.add(name)
            return extract_archive_and_import(spec.name, path)
        finally:
            self._creating.remove(name)

        # Still here?  Someday we'll implement importing dynamic libraries
        # directly from the bundle, but not today.
        return {'fail': path}

    def exec_module(self, module):
        pass


# This works for pure python only.  We don't use it since it's
# slower than just extracting and importing, then deleting.
# Plus extract_archive_and_import works on almost anything.
# def import_from_pure_python_zip(name, zip_path):
#     # Currently for importing from a zip archive with no dynamic libraries.
#     try:
#         t = time()
#         sys.path.insert(0, zip_path)
#         return importlib.import_module(name)
#     finally:
#         print("time to import pure python", time()-t)
#         del sys.path[0]


# Benchmark -- doing it this way (extract and delete)
# for numpy takes 0.5 seconds instead of the 0.3 seconds
# it would likely take with zip import that supports so,
# which we can implement at some point later. We'll see.
def extract_archive_and_import(name, archive_path):
    with tempfile.TemporaryDirectory() as tmpdirname:
        archive_path = zython_modules[name]
        t = time()
        if archive_path.endswith('.zip'):
            zipfile.ZipFile(archive_path).extractall(tmpdirname)
        else:
            tarfile.open(archive_path).extractall(tmpdirname)
        if verbose: print(time() - t, tmpdirname)
        import os
        if verbose: print(os.listdir(tmpdirname))
        try:
            sys.path.insert(0, tmpdirname)
            t = time()
            mod = importlib.import_module(name)
            if verbose: print("module import time: ", time() - t)
            return mod
        finally:
            del sys.path[0]


def install():
    loader = ZythonPackageLoader()
    finder = ZythonPackageFinder(loader)
    sys.meta_path.append(finder)


if __name__ == "__main__":
    install()
    print(sys.path)
    import mpmath
    print(mpmath)
    import sympy
    print(sympy)
    import numpy
    print(numpy)
    print(sys.path)