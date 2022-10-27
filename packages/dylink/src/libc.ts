/*
Create a .c file that exports a function that returns a pointer to
all libc function.  You must include this C code with any other code
you're compiling to build your main file if you want the dynamic
libraries you link to have access to libc.

This adds about 650KB to the wasm file (after stripping), which sucks,
but it is what it is.
*/

import wasmExport from "./wasm-export";

function main() {
  let s = `
/* DO NOT EDIT: THIS CODE IS AUTOGENERATED. */

#define _WASI_EMULATED_MMAN
#define _WASI_EMULATED_SIGNAL
#define _WASI_EMULATED_PROCESS_CLOCKS
#define _WASI_EMULATED_GETPID
#define _GNU_SOURCE
`;

  for (const header of headers.split("\n")) {
    if (!header.trim()) continue;
    s += `#include<${header}>\n`;
  }

  // Some symbols aren't declared in headers that you can import without
  // causing trouble, but are still built, so we declare them here:
  // They aren't declared in the headers due to
  //   #ifdef __wasilibc_unmodified_upstream or #ifdef _GNU_SOURCE
  // Some (like iprintf) are just due to weak_alias.

  s += `
// Undeclared things that do exist in libc-wasi-zig:

char *ecvt(double, int, int *, int *);
char *fcvt(double, int, int *, int *);
char *gcvt(double, int, char *);
char *secure_getenv(const char *);
double      exp10(double);
float       exp10f(float);
long double exp10l(long double);
void        sincos(double, double*, double*);
void        sincosf(float, float*, float*);
void        sincosl(long double, long double*, long double*);
double      pow10(double);
float       pow10f(float);
long double pow10l(long double);
int getdomainname(char *, size_t);
void *memmem(const void *, size_t, const void *, size_t);
char *strcasestr(const char *, const char *);
int strverscmp (const char *, const char *);
void tdestroy(void *, void (*)(void *));
int versionsort(const struct dirent **, const struct dirent **);
int iprintf(const char *__restrict, ...);
int __small_printf(const char *__restrict, ...);
extern char **environ;
extern char **_environ;
char *fgets_unlocked(char *, int, FILE *);
int fputs_unlocked(const char *, FILE *);
wint_t fgetwc_unlocked (FILE *);
wchar_t *fgetws_unlocked (wchar_t *__restrict, int, FILE *__restrict);
int fpurge(FILE *);
void *memrchr(const void *, int, size_t);
wint_t fputwc_unlocked (wchar_t, FILE *);
int fputws_unlocked (const wchar_t *__restrict, FILE *__restrict);
wint_t getwc_unlocked (FILE *);
wint_t getwchar_unlocked (void);
int hcreate_r(size_t, struct hsearch_data *);
void hdestroy_r(struct hsearch_data *);
int hsearch_r(ENTRY, ACTION, ENTRY **, struct hsearch_data *);
long double lgammal_r(long double, int*);
extern char *program_invocation_short_name, *program_invocation_name;
wint_t putwc_unlocked (wchar_t, FILE *);
wint_t putwchar_unlocked (wchar_t);
void qsort_r(void *base, size_t nmemb, size_t size,
           int (*compar)(const void *, const void *, void *),
           void *arg);
void __qsort_r(void *base, size_t nmemb, size_t size,
           int (*compar)(const void *, const void *, void *),
           void *arg);
char *strchrnul(const char *, int);
extern char *__wasilibc_cwd;
extern char **__wasilibc_environ;

int __stack_chk_guard;
void __stack_chk_fail(void);


void *mempcpy(void *, const void *, size_t);

int mkstemp(char *template);
int mkstemps(char *template, int suffixlen);
void __SIG_IGN(int);
double __extenddftf2(long double);
// lib/compiler_rt/trunctfdf2.zig:pub fn __trunctfdf2(a: f128) callconv(.C) f64
double __trunctfdf2(long double);
// lib/compiler_rt/multf3.zig:pub fn __multf3(a: f128, b: f128) callconv(.C) f128 {
long double __multf3(long double a, long double b);
// lib/compiler_rt/addtf3.zig:pub fn __addtf3(a: f128, b: f128) callconv(.C) f128 {
long double __addtf3(long double a, long double b);
// lib/compiler_rt/getf2.zig:fn __gttf2(a: f128, b: f128) callconv(.C) i32 {
int __gttf2(long double a, long double b);
// lib/compiler_rt/getf2.zig:fn __getf2(a: f128, b: f128) callconv(.C) i32 {
int __getf2(long double, long double);
// lib/compiler_rt/divtf3.zig:pub fn __divtf3(a: f128, b: f128) callconv(.C) f128 {
long double __divtf3(long double, long double);
// lib/compiler_rt/cmptf2.zig:fn __lttf2(a: f128, b: f128) callconv(.C) i32 {
int __lttf2(long double, long double);
// lib/compiler_rt/fixtfsi.zig:pub fn __fixtfsi(a: f128) callconv(.C) i32 {
int __fixtfsi(long double);
// lib/compiler_rt/floatsitf.zig:pub fn __floatsitf(a: i32) callconv(.C) f128 {
long double __floatsitf(int);
// lib/compiler_rt/subtf3.zig:pub fn __subtf3(a: f128, b: f128) callconv(.C) f128 {
long double __subtf3(long double, long double);
// lib/compiler_rt/floatditf.zig:pub fn __floatditf(a: i64) callconv(.C) f128 {
long double __floatditf(double a);
// __unordtf2(a: f128, b: f128) callconv(.C) i32
int __unordtf2(long double, long double);
// fn __letf2(a: f128, b: f128) callconv(.C) i32
int __letf2(long double, long double);
// pub fn __trunctfsf2(a: f128) callconv(.C) f32
float __trunctfsf2(long double);
// pub fn __fixtfdi(a: f128) callconv(.C) i64
long __fixtfdi(long double);
// pub fn __floatunsitf(a: u32) callconv(.C) f128
long double __floatunsitf(unsigned int);
// pub fn __floatunditf(a: u64) callconv(.C) f128
long double __floatunditf(unsigned long);
// pub fn __extendsftf2(a: f32) callconv(.C) f128
long double __extendsftf2(float);
// fn __netf2(a: f128, b: f128) callconv(.C) i32
int __netf2(long double, long double);
// pub fn __fixunstfsi(a: f128) callconv(.C) u32
unsigned int __fixunstfsi(long double);
// pub fn __fixunstfdi(a: f128) callconv(.C) u64
unsigned long __fixunstfdi(long double);
// fn __eqtf2(a: f128, b: f128) callconv(.C) i32
int __eqtf2(long double,long double);

// pub fn __multi3(a: i128, b: i128) callconv(.C) i128
long long __multi3(long long, long long);

// pub fn __udivti3(a: u128, b: u128) callconv(.C) u128
unsigned long long __udivti3(unsigned long long, unsigned long long);

// fn __eqtf2(a: f128, b: f128) callconv(.C) i32
int __eqtf2(long double, long double);

// pub fn __fixunstfdi(a: f128) callconv(.C) u64
unsigned long __fixunstfdi(long double);

// pub fn __fixunstfsi(a: f128) callconv(.C) u32
unsigned int __fixunstfsi(long double);

long double strtold_l(const char *__restrict, char **__restrict, struct __locale_struct *);

// TODO - move to posix-wasm, obviously...
extern const char *__progname;
const char *getprogname() { return __progname; }
void setprogname(const char *progname) {
  int i;
  for(i=strlen(progname)-1;i>=0 && progname[i] != '/';i--){}
  __progname = progname+i+1;
}

void freeaddrinfo(struct addrinfo *res);
void _Py_CheckEmscriptenSignalsPeriodically();
void _Py_CheckEmscriptenSignals();

// NULL for these two means "no info".
struct group  *getgrgid(gid_t) { return NULL; }
struct group  *getgrnam(const char *) { return NULL; }
`;
  s += "\n";
  s += wasmExport((symbols + "\n" + posix).split("\n"));
  s += "WASM_EXPORT(__stack_chk_guard, __stack_chk_guard);";
  console.log(s);
}

// Extra things we added to our posix compat layer, since they are
// missing from wasi-zig-libc:
const posix = `
cowasm_fstat
cowasm_lstat
cowasm_stat
cowasm_fstatat
getgrgid
getgrnam
heapsort
mergesort
setmode
getmode
_Py_CheckEmscriptenSignalsPeriodically
_Py_CheckEmscriptenSignals
fopencookie
tmpfile
strtold_l
__fixunstfsi
__fixunstfdi
__eqtf2
__udivti3
__multi3
__letf2
__trunctfsf2
__fixtfdi
__floatunsitf
__floatunditf
__extendsftf2
__netf2
__fixunstfsi
__fixunstfdi
__eqtf2
__unordtf2
__floatditf
__floatsitf
__fixtfsi
__lttf2
__divtf3
__getf2
__gttf2
__subtf3
__multf3
__addtf3
__extenddftf2
__trunctfdf2
qsort
flockfile
ftrylockfile
funlockfile
freeaddrinfo
strsignal
__stack_chk_fail
secure_getenv
strunvis
strnvis
strvis
cfgetispeed
cfgetospeed
tcgetattr
tcsetattr
textdomain
gettext
dgettext
dcgettext
getpagesize
mkstemp
mkstemps
sigemptyset
bindtextdomain
mmap
munmap
geteuid
fchown
popen
pclose
getrusage
`;

// All headers from zig/dist/lib/zig/libc/include/wasm-wasi-musl except signal/thread ones.
// Also, include our posix-wasm.h, which fills in declarations for things in posix that are
// missing from libc-wasi-zig.
const headers = `
posix-wasm.h
alloca.h
ar.h
arpa/telnet.h
arpa/ftp.h
arpa/inet.h
arpa/tftp.h
arpa/nameser.h
arpa/nameser_compat.h
assert.h
bits/ipcstat.h
bits/ioctl.h
bits/reg.h
bits/ioctl_fix.h
bits/float.h
bits/limits.h
bits/fcntl.h
bits/stat.h
bits/signal.h
bits/dirent.h
bits/mman.h
bits/io.h
bits/posix.h
bits/resource.h
bits/poll.h
bits/alltypes.h
bits/socket.h
bits/stdint.h
bits/hwcap.h
byteswap.h
complex.h
cpio.h
crypt.h
ctype.h
dirent.h
endian.h
err.h
errno.h
fcntl.h
features.h
fenv.h
float.h
fmtmsg.h
fnmatch.h
fts.h
ftw.h
getopt.h
glob.h
iconv.h
ifaddrs.h
inttypes.h
iso646.h
langinfo.h
libgen.h
libintl.h
limits.h
locale.h
malloc.h
math.h
memory.h
monetary.h
mqueue.h
netinet/tcp.h
netinet/ip_icmp.h
netinet/igmp.h
netinet/in.h
netinet/ip6.h
netinet/icmp6.h
netinet/ip.h
netinet/in_systm.h
netinet/udp.h
netpacket/packet.h
nl_types.h
poll.h
pthread.h
regex.h
sched.h
search.h
semaphore.h
spawn.h
stdalign.h
stdbool.h
stdc-predef.h
stdint.h
stdio.h
stdio_ext.h
stdlib.h
stdnoreturn.h
string.h
strings.h
stropts.h
syscall.h
sysexits.h
sys/time.h
sys/ioctl.h
sys/reg.h
sys/timeb.h
sys/uio.h
sys/types.h
sys/times.h
sys/eventfd.h
sys/sysinfo.h
sys/fcntl.h
sys/file.h
sys/stat.h
sys/mman.h
sys/stropts.h
sys/un.h
sys/utsname.h
sys/timex.h
sys/param.h
sys/ttydefaults.h
sys/resource.h
sys/errno.h
sys/poll.h
sys/syscall.h
sys/socket.h
sys/dir.h
sys/random.h
sys/select.h
tar.h
tgmath.h
time.h
uchar.h
unistd.h
utime.h
values.h
wasi/libc-environ.h
wasi/libc-find-relpath.h
wasi/libc-nocwd.h
wasi/api.h
wasi/libc.h
wchar.h
wctype.h
`;

// I copied libc.a by watching the output of zig build something targeting
// wasm-wasi with an empty cache.  Then this gets ALL symbols that are defined
// in the wasm32-wasi library from clang/musl/zig that don't start with a double
// underscore or _IO_ (no clue what those are).  The symbols ending in 64 seems
// to all be #defined to the non-64 ones, so we exclude those.
//
// nm -gU libc.a |grep -v : | awk '{print $3}' |sort|uniq |grep -v ^__ |grep -v ^_IO_ |grep -v 64$  > all-symbols.txt && nm -gU libc.a |grep -v : | awk '{print $3}' |sort|uniq |grep  ^__wasi >> all-symbols.txt
//
// NOTE: I'm often finding that excluding symbols starting with dunder __ was a mistake,
// since they often pop up with new dynamic libraries, presumably since they are the
// targets of #define.

const symbols = `
pthread_attr_init
pthread_attr_destroy
pthread_attr_setstacksize
pthread_attr_getstacksize
pthread_cond_init
pthread_cond_destroy
pthread_cond_signal
pthread_condattr_init
pthread_condattr_setclock
pthread_getspecific
pthread_setspecific
pthread_key_create
pthread_key_delete
pthread_mutex_init
pthread_mutex_destroy
pthread_mutex_lock
pthread_mutex_unlock
pthread_mutex_trylock
pthread_self
pthread_create
pthread_detach
pthread_exit
pthread_cond_timedwait
pthread_cond_wait
pthread_getcpuclockid
fchmod
cfsetispeed
cfsetospeed
__assert_fail
sigaction
signal
__SIG_ERR
__SIG_IGN
__ctype_get_mb_cur_max
_CLOCK_MONOTONIC
_CLOCK_PROCESS_CPUTIME_ID
_CLOCK_REALTIME
_CLOCK_THREAD_CPUTIME_ID
_Exit
_environ
_exit
_flushlbf
a64l
abort
abs
access
acos
acosf
acosh
acoshf
acoshl
acosl
aligned_alloc
alphasort
arc4random
arc4random_buf
arc4random_uniform
asctime
asctime_r
asin
asinf
asinh
asinhf
asinhl
asinl
asprintf
at_quick_exit
atan
atan2
atan2f
atan2l
atanf
atanh
atanhf
atanhl
atanl
atexit
atof
atoi
atol
atoll
basename
bcmp
bcopy
bsearch
btowc
bzero
c16rtomb
c32rtomb
cabs
cabsf
cabsl
cacos
cacosf
cacosh
cacoshf
cacoshl
cacosl
calloc
carg
cargf
cargl
casin
casinf
casinh
casinhf
casinhl
casinl
catan
catanf
catanh
catanhf
catanhl
catanl
catclose
catgets
catopen
cbrt
cbrtf
cbrtl
ccos
ccosf
ccosh
ccoshf
ccoshl
ccosl
ceil
ceilf
ceill
cexp
cexpf
cexpl
chdir
cimag
cimagf
cimagl
clearenv
clearerr
clearerr_unlocked
clock
clock_getres
clock_gettime
clock_nanosleep
clog
clogf
clogl
close
closedir
confstr
conj
conjf
conjl
copysign
copysignf
copysignl
cos
cosf
cosh
coshf
coshl
cosl
cpow
cpowf
cpowl
cproj
cprojf
cprojl
creal
crealf
creall
creat
crypt
crypt_r
csin
csinf
csinh
csinhf
csinhl
csinl
csqrt
csqrtf
csqrtl
ctan
ctanf
ctanh
ctanhf
ctanhl
ctanl
ctime
ctime_r
difftime
dirfd
dirname
div
dprintf
drand48
drem
dremf
duplocale
ecvt
encrypt
environ
erand48
erf
erfc
erfcf
erfcl
erff
erfl
err
errx
verr
verrx
errno
exit
exp
exp10
exp10f
exp10l
exp2
exp2f
exp2l
expf
expl
explicit_bzero
expm1
expm1f
expm1l
fabs
fabsf
fabsl
faccessat
fclose
fcntl
fcvt
fdatasync
fdclosedir
fdim
fdimf
fdiml
fdopen
fdopendir
feclearexcept
fegetenv
fegetexceptflag
fegetround
feholdexcept
feof
feof_unlocked
feraiseexcept
ferror
ferror_unlocked
fesetenv
fesetexceptflag
fesetround
fetestexcept
feupdateenv
fflush
fflush_unlocked
ffs
ffsl
ffsll
fgetc
fgetc_unlocked
fgetln
fgetpos
fgets
fgets_unlocked
fgetwc
fgetwc_unlocked
fgetws
fgetws_unlocked
fileno
fileno_unlocked
finite
finitef
floor
floorf
floorl
fma
fmaf
fmal
fmax
fmaxf
fmaxl
fmemopen
fmin
fminf
fminl
fmod
fmodf
fmodl
fmtmsg
fnmatch
fopen
fpathconf
fprintf
fpurge
fputc
fputc_unlocked
fputs
fputs_unlocked
fputwc
fputwc_unlocked
fputws
fputws_unlocked
fread
fread_unlocked
free
freelocale
freopen
frexp
frexpf
frexpl
fscanf
fseek
fseeko
fsetpos
fstat
fstatat
fsync
ftell
ftello
ftime
ftruncate
fts_children
fts_close
fts_open
fts_read
fts_set
futimens
fwide
fwprintf
fwrite
fwrite_unlocked
fwscanf
gcvt
get_avphys_pages
get_nprocs
get_nprocs_conf
get_phys_pages
getc
getc_unlocked
getchar
getchar_unlocked
getcwd
getdate
getdate_err
getdelim
getdomainname
getentropy
getenv
gethostid
getline
getopt
getopt_long
getopt_long_only
setprogname
getprogname
__progname
getsockopt
getsubopt
gettimeofday
getw
getwc
getwc_unlocked
getwchar
getwchar_unlocked
glob
globfree
gmtime
gmtime_r
hcreate
hcreate_r
hdestroy
hdestroy_r
hsearch
hsearch_r
htonl
htons
hypot
hypotf
hypotl
iconv
iconv_close
iconv_open
ilogb
ilogbf
ilogbl
imaxabs
imaxdiv
in6addr_any
in6addr_loopback
index
inet_aton
inet_ntop
inet_pton
initstate
insque
ioctl
iprintf
__small_printf
isalnum
isalnum_l
isalpha
isalpha_l
isascii
isatty
isblank
isblank_l
iscntrl
iscntrl_l
isdigit
isdigit_l
isgraph
isgraph_l
islower
islower_l
isprint
isprint_l
ispunct
ispunct_l
isspace
isspace_l
isupper
isupper_l
iswalnum
iswalnum_l
iswalpha
iswalpha_l
iswblank
iswblank_l
iswcntrl
iswcntrl_l
iswctype
iswctype_l
iswdigit
iswdigit_l
iswgraph
iswgraph_l
iswlower
iswlower_l
iswprint
iswprint_l
iswpunct
iswpunct_l
iswspace
iswspace_l
iswupper
iswupper_l
iswxdigit
iswxdigit_l
isxdigit
isxdigit_l
j0
j0f
j1
j1f
jn
jnf
jrand48
l64a
labs
lcong48
ldexp
ldexpf
ldexpl
ldiv
lfind
lgamma
lgamma_r
lgammaf
lgammaf_r
lgammal
lgammal_r
link
linkat
llabs
lldiv
llrint
llrintf
llrintl
llround
llroundf
llroundl
localeconv
localtime
localtime_r
log
log10
log10f
log10l
log1p
log1pf
log1pl
log2
log2f
log2l
logb
logbf
logbl
logf
logl
lrand48
lrint
lrintf
lrintl
lround
lroundf
lroundl
lsearch
lseek
lstat
malloc
malloc_usable_size
mblen
mbrlen
mbrtoc16
mbrtoc32
mbrtowc
mbsinit
mbsnrtowcs
mbsrtowcs
mbstowcs
mbtowc
memccpy
memchr
memcmp
memcpy
memmem
memmove
mempcpy
memrchr
memset
mkdir
mkdirat
mkdtemp
mktime
modf
modff
modfl
mrand48
nan
nanf
nanl
nanosleep
nearbyint
nearbyintf
nearbyintl
newlocale
nextafter
nextafterf
nextafterl
nexttoward
nexttowardf
nexttowardl
nftw
nl_langinfo
nl_langinfo_l
nrand48
ntohl
ntohs
open
open_memstream
open_wmemstream
openat
opendir
opendirat
optarg
opterr
optind
optopt
optreset
pathconf
perror
poll
posix_close
posix_fadvise
posix_fallocate
posix_memalign
pow
pow10
pow10f
pow10l
powf
powl
pread
preadv
printf
program_invocation_name
program_invocation_short_name
pselect
putc
putc_unlocked
putchar
putchar_unlocked
putenv
puts
putw
putwc
putwc_unlocked
putwchar
putwchar_unlocked
pwrite
pwritev
qsort_r
__qsort_r
quick_exit
rand
rand_r
random
read
readdir
readlink
readlinkat
readv
realloc
reallocarray
recv
regcomp
regerror
regexec
regfree
remainder
remainderf
remainderl
remove
remque
remquo
remquof
remquol
rename
renameat
rewind
rewinddir
rindex
rint
rintf
rintl
rmdir
round
roundf
roundl
rpmatch
sbrk
scalb
scalbf
scalbln
scalblnf
scalblnl
scalbn
scalbnf
scalbnl
scandir
scandirat
scanf
sched_yield
seed48
seekdir
select
send
setbuf
setbuffer
setenv
setkey
setlinebuf
setlocale
setstate
setvbuf
shutdown
signgam
significand
significandf
sin
sincos
sincosf
sincosl
sinf
sinh
sinhf
sinhl
sinl
sleep
snprintf
sprintf
sqrt
sqrtf
sqrtl
srand
srand48
srandom
sscanf
stat
stderr
stdin
stdout
stpcpy
stpncpy
strcasecmp
strcasecmp_l
strcasestr
strcat
strchr
strchrnul
strcmp
strcoll
strcoll_l
strcpy
strcspn
strdup
strerror
strerror_l
strerror_r
strfmon
strfmon_l
strftime
strftime_l
strlcat
strlcpy
strlen
strncasecmp
strncasecmp_l
strncat
strncmp
strncpy
strndup
strnlen
strpbrk
strptime
strrchr
strsep
strspn
strstr
strtod
strtof
strtoq
strtoimax
strtonum
strtok
strtok_r
strtol
strtold
strtoll
strtoul
strtoull
strtoumax
strverscmp
strxfrm
strxfrm_l
swab
swprintf
swscanf
symlink
symlinkat
sysconf
tan
tanf
tanh
tanhf
tanhl
tanl
tdelete
tdestroy
telldir
tfind
tgamma
tgammaf
tgammal
time
times
timegm
timespec_get
tmpnam
toascii
tolower
tolower_l
toupper
toupper_l
towctrans
towctrans_l
towlower
towlower_l
towupper
towupper_l
trunc
truncate
truncf
truncl
tsearch
twalk
uname
ungetc
ungetwc
unlink
unlinkat
unsetenv
uselocale
usleep
utime
utimensat
utimes
vasprintf
vdprintf
versionsort
vfprintf
vfscanf
vfwprintf
vfwscanf
vprintf
vscanf
vsnprintf
vsprintf
vsscanf
vswprintf
vswscanf
vwprintf
vwscanf
vwarn
vwarnx
warn
warnx
wcpcpy
wcpncpy
wcrtomb
wcscasecmp
wcscasecmp_l
wcscat
wcschr
wcscmp
wcscoll
wcscoll_l
wcscpy
wcscspn
wcsdup
wcsftime
wcsftime_l
wcslen
wcsncasecmp
wcsncasecmp_l
wcsncat
wcsncmp
wcsncpy
wcsnlen
wcsnrtombs
wcspbrk
wcsrchr
wcsrtombs
wcsspn
wcsstr
wcstod
wcstof
wcstoimax
wcstok
wcstol
wcstold
wcstoll
wcstombs
wcstoul
wcstoull
wcstoumax
wcswcs
wcswidth
wcsxfrm
wcsxfrm_l
wctob
wctomb
wctrans
wctrans_l
wctype
wctype_l
wcwidth
wmemchr
wmemcmp
wmemcpy
wmemmove
wmemset
wprintf
write
writev
wscanf
y0
y0f
y1
y1f
yn
ynf
__wasi_args_get
__wasi_args_sizes_get
__wasi_clock_res_get
__wasi_clock_time_get
__wasi_environ_get
__wasi_environ_sizes_get
__wasi_fd_advise
__wasi_fd_allocate
__wasi_fd_close
__wasi_fd_datasync
__wasi_fd_fdstat_get
__wasi_fd_fdstat_set_flags
__wasi_fd_fdstat_set_rights
__wasi_fd_filestat_get
__wasi_fd_filestat_set_size
__wasi_fd_filestat_set_times
__wasi_fd_pread
__wasi_fd_prestat_dir_name
__wasi_fd_prestat_get
__wasi_fd_pwrite
__wasi_fd_read
__wasi_fd_readdir
__wasi_fd_renumber
__wasi_fd_seek
__wasi_fd_sync
__wasi_fd_tell
__wasi_fd_write
__wasi_path_create_directory
__wasi_path_filestat_get
__wasi_path_filestat_set_times
__wasi_path_link
__wasi_path_open
__wasi_path_readlink
__wasi_path_remove_directory
__wasi_path_rename
__wasi_path_symlink
__wasi_path_unlink_file
__wasi_poll_oneoff
__wasi_proc_exit
__wasi_random_get
__wasi_sched_yield
__wasi_sock_recv
__wasi_sock_send
__wasi_sock_shutdown
__wasilibc_access
__wasilibc_cwd
__wasilibc_ensure_environ
__wasilibc_environ
__wasilibc_fd_renumber
__wasilibc_find_abspath
__wasilibc_find_relpath
__wasilibc_find_relpath_alloc
__wasilibc_initialize_environ
__wasilibc_link
__wasilibc_link_newat
__wasilibc_link_oldat
__wasilibc_nocwd___wasilibc_rmdirat
__wasilibc_nocwd___wasilibc_unlinkat
__wasilibc_nocwd_faccessat
__wasilibc_nocwd_fstatat
__wasilibc_nocwd_linkat
__wasilibc_nocwd_mkdirat_nomode
__wasilibc_nocwd_openat_nomode
__wasilibc_nocwd_opendirat
__wasilibc_nocwd_readlinkat
__wasilibc_nocwd_renameat
__wasilibc_nocwd_scandirat
__wasilibc_nocwd_symlinkat
__wasilibc_nocwd_utimensat
__wasilibc_open_nomode
__wasilibc_register_preopened_fd
__wasilibc_rename_newat
__wasilibc_rename_oldat
__wasilibc_rmdirat
__wasilibc_stat
__wasilibc_tell
__wasilibc_unlinkat
__wasilibc_utimens


`;

main();
export {};
