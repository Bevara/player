// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
var ENVIRONMENT_IS_PTHREAD = false;

import { _emscripten_asm_const_int } from './imports/_emscripten_asm_const_int'
import { _exit } from './imports/_exit'
import { ___sys_getpriority } from './imports/___sys_getpriority'
import { ___sys_getresuid32 } from './imports/___sys_getresuid32'
import { ___asctime } from './imports/___asctime'
import { ___call_sighandler } from './imports/___call_sighandler'
import { ___clock_gettime } from './imports/___clock_gettime'
import { ___cxa_atexit } from './imports/___cxa_atexit'
import { ___gmtime_r } from './imports/___gmtime_r'
import { ___heap_base } from './imports/___heap_base'
import { ___localtime_r } from './imports/___localtime_r'
import { ___map_file } from './imports/___map_file'
import { ___memory_base } from './imports/___memory_base'
import { ___stack_pointer } from './imports/___stack_pointer'
import { ___sys__newselect } from './imports/___sys__newselect'
import { ___sys_accept4 } from './imports/___sys_accept4'
import { ___sys_access } from './imports/___sys_access'
import { ___sys_acct } from './imports/___sys_acct'
import { ___sys_bind } from './imports/___sys_bind'
import { ___sys_chdir } from './imports/___sys_chdir'
import { ___sys_chmod } from './imports/___sys_chmod'
import { ___sys_chown32 } from './imports/___sys_chown32'
import { ___sys_connect } from './imports/___sys_connect'
import { ___sys_dup } from './imports/___sys_dup'
import { ___sys_dup2 } from './imports/___sys_dup2'
import { ___sys_dup3 } from './imports/___sys_dup3'
import { ___sys_fadvise64_64 } from './imports/___sys_fadvise64_64'
import { ___sys_fallocate } from './imports/___sys_fallocate'
import { ___sys_fchdir } from './imports/___sys_fchdir'
import { ___sys_fchmod } from './imports/___sys_fchmod'
import { ___sys_fchmodat } from './imports/___sys_fchmodat'
import { ___sys_fchown32 } from './imports/___sys_fchown32'
import { ___sys_fchownat } from './imports/___sys_fchownat'
import { ___sys_fcntl64 } from './imports/___sys_fcntl64'
import { ___sys_fdatasync } from './imports/___sys_fdatasync'
import { ___sys_fstat64 } from './imports/___sys_fstat64'
import { ___sys_fstatat64 } from './imports/___sys_fstatat64'
import { ___sys_fstatfs64 } from './imports/___sys_fstatfs64'
import { ___sys_ftruncate64 } from './imports/___sys_ftruncate64'
import { ___sys_getcwd } from './imports/___sys_getcwd'
import { ___sys_getdents64 } from './imports/___sys_getdents64'
import { ___sys_getegid32 } from './imports/___sys_getegid32'
import { ___sys_geteuid32 } from './imports/___sys_geteuid32'
import { ___sys_getgroups32 } from './imports/___sys_getgroups32'
import { ___sys_getitimer } from './imports/___sys_getitimer'
import { ___sys_getpeername } from './imports/___sys_getpeername'
import { ___sys_getpgid } from './imports/___sys_getpgid'
import { ___sys_getpid } from './imports/___sys_getpid'
import { ___sys_getppid } from './imports/___sys_getppid'
import { ___sys_getresgid32 } from './imports/___sys_getresgid32'
import { ___sys_getrusage } from './imports/___sys_getrusage'
import { ___sys_getsid } from './imports/___sys_getsid'
import { ___sys_getsockname } from './imports/___sys_getsockname'
import { ___sys_getsockopt } from './imports/___sys_getsockopt'
import { ___sys_getuid32 } from './imports/___sys_getuid32'
import { ___sys_ioctl } from './imports/___sys_ioctl'
import { ___sys_lchown32 } from './imports/___sys_lchown32'
import { ___sys_link } from './imports/___sys_link'
import { ___sys_linkat } from './imports/___sys_linkat'
import { ___sys_listen } from './imports/___sys_listen'
import { ___sys_lstat64 } from './imports/___sys_lstat64'
import { ___sys_madvise1 } from './imports/___sys_madvise1'
import { ___sys_mincore } from './imports/___sys_mincore'
import { ___sys_mkdir } from './imports/___sys_mkdir'
import { ___sys_mkdirat } from './imports/___sys_mkdirat'
import { ___sys_mknod } from './imports/___sys_mknod'
import { ___sys_mknodat } from './imports/___sys_mknodat'
import { ___sys_mlock } from './imports/___sys_mlock'
import { ___sys_mlockall } from './imports/___sys_mlockall'
import { ___sys_mprotect } from './imports/___sys_mprotect'
import { ___sys_mremap } from './imports/___sys_mremap'
import { ___sys_msync } from './imports/___sys_msync'
import { ___sys_munlock } from './imports/___sys_munlock'
import { ___sys_munlockall } from './imports/___sys_munlockall'
import { ___sys_munmap } from './imports/___sys_munmap'
import { ___sys_nice } from './imports/___sys_nice'
import { ___sys_open } from './imports/___sys_open'
import { ___sys_openat } from './imports/___sys_openat'
import { ___sys_pause } from './imports/___sys_pause'
import { ___sys_pipe } from './imports/___sys_pipe'
import { ___sys_pipe2 } from './imports/___sys_pipe2'
import { ___sys_poll } from './imports/___sys_poll'
import { ___sys_prlimit64 } from './imports/___sys_prlimit64'
import { ___sys_pselect6 } from './imports/___sys_pselect6'
import { ___sys_readlink } from './imports/___sys_readlink'
import { ___sys_readlinkat } from './imports/___sys_readlinkat'
import { ___sys_recvfrom } from './imports/___sys_recvfrom'
import { ___sys_recvmmsg } from './imports/___sys_recvmmsg'
import { ___sys_recvmsg } from './imports/___sys_recvmsg'
import { ___sys_rename } from './imports/___sys_rename'
import { ___sys_renameat } from './imports/___sys_renameat'
import { ___sys_rmdir } from './imports/___sys_rmdir'
import { ___sys_sendmmsg } from './imports/___sys_sendmmsg'
import { ___sys_sendmsg } from './imports/___sys_sendmsg'
import { ___sys_sendto } from './imports/___sys_sendto'
import { ___sys_setdomainname } from './imports/___sys_setdomainname'
import { ___sys_setitimer } from './imports/___sys_setitimer'
import { ___sys_setpgid } from './imports/___sys_setpgid'
import { ___sys_setpriority } from './imports/___sys_setpriority'
import { ___sys_setrlimit } from './imports/___sys_setrlimit'
import { ___sys_setsid } from './imports/___sys_setsid'
import { ___sys_setsockopt } from './imports/___sys_setsockopt'
import { ___sys_shutdown } from './imports/___sys_shutdown'
import { ___sys_socket } from './imports/___sys_socket'
import { ___sys_socketpair } from './imports/___sys_socketpair'
import { ___sys_stat64 } from './imports/___sys_stat64'
import { ___sys_statfs64 } from './imports/___sys_statfs64'
import { ___sys_symlink } from './imports/___sys_symlink'
import { ___sys_symlinkat } from './imports/___sys_symlinkat'
import { ___sys_sync } from './imports/___sys_sync'
import { ___sys_truncate64 } from './imports/___sys_truncate64'
import { ___sys_ugetrlimit } from './imports/___sys_ugetrlimit'
import { ___sys_umask } from './imports/___sys_umask'
import { ___sys_uname } from './imports/___sys_uname'
import { ___sys_unlink } from './imports/___sys_unlink'
import { ___sys_unlinkat } from './imports/___sys_unlinkat'
import { ___sys_utimensat } from './imports/___sys_utimensat'
import { ___sys_wait4 } from './imports/___sys_wait4'
import { ___table_base } from './imports/___table_base'
import { __emscripten_throw_longjmp } from './imports/__emscripten_throw_longjmp'
import { _abort } from './imports/_abort'
import { _alBuffer3f } from './imports/_alBuffer3f'
import { _alBuffer3i } from './imports/_alBuffer3i'
import { _alBufferData } from './imports/_alBufferData'
import { _alBufferf } from './imports/_alBufferf'
import { _alBufferfv } from './imports/_alBufferfv'
import { _alBufferi } from './imports/_alBufferi'
import { _alBufferiv } from './imports/_alBufferiv'
import { _alDeleteBuffers } from './imports/_alDeleteBuffers'
import { _alDeleteSources } from './imports/_alDeleteSources'
import { _alDisable } from './imports/_alDisable'
import { _alDistanceModel } from './imports/_alDistanceModel'
import { _alDopplerFactor } from './imports/_alDopplerFactor'
import { _alDopplerVelocity } from './imports/_alDopplerVelocity'
import { _alEnable } from './imports/_alEnable'
import { _alGenBuffers } from './imports/_alGenBuffers'
import { _alGenSources } from './imports/_alGenSources'
import { _alGetBoolean } from './imports/_alGetBoolean'
import { _alGetBooleanv } from './imports/_alGetBooleanv'
import { _alGetBuffer3f } from './imports/_alGetBuffer3f'
import { _alGetBuffer3i } from './imports/_alGetBuffer3i'
import { _alGetBufferf } from './imports/_alGetBufferf'
import { _alGetBufferfv } from './imports/_alGetBufferfv'
import { _alGetBufferi } from './imports/_alGetBufferi'
import { _alGetBufferiv } from './imports/_alGetBufferiv'
import { _alGetDouble } from './imports/_alGetDouble'
import { _alGetDoublev } from './imports/_alGetDoublev'
import { _alGetEnumValue } from './imports/_alGetEnumValue'
import { _alGetError } from './imports/_alGetError'
import { _alGetFloat } from './imports/_alGetFloat'
import { _alGetFloatv } from './imports/_alGetFloatv'
import { _alGetInteger } from './imports/_alGetInteger'
import { _alGetIntegerv } from './imports/_alGetIntegerv'
import { _alGetListener3f } from './imports/_alGetListener3f'
import { _alGetListener3i } from './imports/_alGetListener3i'
import { _alGetListenerf } from './imports/_alGetListenerf'
import { _alGetListenerfv } from './imports/_alGetListenerfv'
import { _alGetListeneri } from './imports/_alGetListeneri'
import { _alGetListeneriv } from './imports/_alGetListeneriv'
import { _alGetSource3f } from './imports/_alGetSource3f'
import { _alGetSource3i } from './imports/_alGetSource3i'
import { _alGetSourcef } from './imports/_alGetSourcef'
import { _alGetSourcefv } from './imports/_alGetSourcefv'
import { _alGetSourcei } from './imports/_alGetSourcei'
import { _alGetSourceiv } from './imports/_alGetSourceiv'
import { _alGetString } from './imports/_alGetString'
import { _alIsBuffer } from './imports/_alIsBuffer'
import { _alIsEnabled } from './imports/_alIsEnabled'
import { _alIsExtensionPresent } from './imports/_alIsExtensionPresent'
import { _alIsSource } from './imports/_alIsSource'
import { _alListener3f } from './imports/_alListener3f'
import { _alListener3i } from './imports/_alListener3i'
import { _alListenerf } from './imports/_alListenerf'
import { _alListenerfv } from './imports/_alListenerfv'
import { _alListeneri } from './imports/_alListeneri'
import { _alListeneriv } from './imports/_alListeneriv'
import { _alSource3f } from './imports/_alSource3f'
import { _alSource3i } from './imports/_alSource3i'
import { _alSourcePause } from './imports/_alSourcePause'
import { _alSourcePausev } from './imports/_alSourcePausev'
import { _alSourcePlay } from './imports/_alSourcePlay'
import { _alSourcePlayv } from './imports/_alSourcePlayv'
import { _alSourceQueueBuffers } from './imports/_alSourceQueueBuffers'
import { _alSourceRewind } from './imports/_alSourceRewind'
import { _alSourceRewindv } from './imports/_alSourceRewindv'
import { _alSourceStop } from './imports/_alSourceStop'
import { _alSourceStopv } from './imports/_alSourceStopv'
import { _alSourceUnqueueBuffers } from './imports/_alSourceUnqueueBuffers'
import { _alSourcef } from './imports/_alSourcef'
import { _alSourcefv } from './imports/_alSourcefv'
import { _alSourcei } from './imports/_alSourcei'
import { _alSourceiv } from './imports/_alSourceiv'
import { _alSpeedOfSound } from './imports/_alSpeedOfSound'
import { _alcCaptureCloseDevice } from './imports/_alcCaptureCloseDevice'
import { _alcCaptureOpenDevice } from './imports/_alcCaptureOpenDevice'
import { _alcCaptureSamples } from './imports/_alcCaptureSamples'
import { _alcCaptureStart } from './imports/_alcCaptureStart'
import { _alcCaptureStop } from './imports/_alcCaptureStop'
import { _alcCloseDevice } from './imports/_alcCloseDevice'
import { _alcCreateContext } from './imports/_alcCreateContext'
import { _alcDestroyContext } from './imports/_alcDestroyContext'
import { _alcGetContextsDevice } from './imports/_alcGetContextsDevice'
import { _alcGetCurrentContext } from './imports/_alcGetCurrentContext'
import { _alcGetEnumValue } from './imports/_alcGetEnumValue'
import { _alcGetError } from './imports/_alcGetError'
import { _alcGetIntegerv } from './imports/_alcGetIntegerv'
import { _alcGetString } from './imports/_alcGetString'
import { _alcIsExtensionPresent } from './imports/_alcIsExtensionPresent'
import { _alcMakeContextCurrent } from './imports/_alcMakeContextCurrent'
import { _alcOpenDevice } from './imports/_alcOpenDevice'
import { _alcProcessContext } from './imports/_alcProcessContext'
import { _alcSuspendContext } from './imports/_alcSuspendContext'
import { _clock_gettime } from './imports/_clock_gettime'
import { _emscripten_alcDevicePauseSOFT } from './imports/_emscripten_alcDevicePauseSOFT'
import { _emscripten_alcDeviceResumeSOFT } from './imports/_emscripten_alcDeviceResumeSOFT'
import { _emscripten_alcGetStringiSOFT } from './imports/_emscripten_alcGetStringiSOFT'
import { _emscripten_alcResetDeviceSOFT } from './imports/_emscripten_alcResetDeviceSOFT'
import { _emscripten_get_heap_max } from './imports/_emscripten_get_heap_max'
import { _emscripten_glActiveTexture } from './imports/_emscripten_glActiveTexture'
import { _emscripten_glAttachShader } from './imports/_emscripten_glAttachShader'
import { _emscripten_glBeginQueryEXT } from './imports/_emscripten_glBeginQueryEXT'
import { _emscripten_glBindAttribLocation } from './imports/_emscripten_glBindAttribLocation'
import { _emscripten_glBindBuffer } from './imports/_emscripten_glBindBuffer'
import { _emscripten_glBindFramebuffer } from './imports/_emscripten_glBindFramebuffer'
import { _emscripten_glBindRenderbuffer } from './imports/_emscripten_glBindRenderbuffer'
import { _emscripten_glBindTexture } from './imports/_emscripten_glBindTexture'
import { _emscripten_glBindVertexArrayOES } from './imports/_emscripten_glBindVertexArrayOES'
import { _emscripten_glBlendColor } from './imports/_emscripten_glBlendColor'
import { _emscripten_glBlendEquation } from './imports/_emscripten_glBlendEquation'
import { _emscripten_glBlendEquationSeparate } from './imports/_emscripten_glBlendEquationSeparate'
import { _emscripten_glBlendFunc } from './imports/_emscripten_glBlendFunc'
import { _emscripten_glBlendFuncSeparate } from './imports/_emscripten_glBlendFuncSeparate'
import { _emscripten_glBufferData } from './imports/_emscripten_glBufferData'
import { _emscripten_glBufferSubData } from './imports/_emscripten_glBufferSubData'
import { _emscripten_glCheckFramebufferStatus } from './imports/_emscripten_glCheckFramebufferStatus'
import { _emscripten_glClear } from './imports/_emscripten_glClear'
import { _emscripten_glClearColor } from './imports/_emscripten_glClearColor'
import { _emscripten_glClearDepthf } from './imports/_emscripten_glClearDepthf'
import { _emscripten_glClearStencil } from './imports/_emscripten_glClearStencil'
import { _emscripten_glColorMask } from './imports/_emscripten_glColorMask'
import { _emscripten_glCompileShader } from './imports/_emscripten_glCompileShader'
import { _emscripten_glCompressedTexImage2D } from './imports/_emscripten_glCompressedTexImage2D'
import { _emscripten_glCompressedTexSubImage2D } from './imports/_emscripten_glCompressedTexSubImage2D'
import { _emscripten_glCopyTexImage2D } from './imports/_emscripten_glCopyTexImage2D'
import { _emscripten_glCopyTexSubImage2D } from './imports/_emscripten_glCopyTexSubImage2D'
import { _emscripten_glCreateProgram } from './imports/_emscripten_glCreateProgram'
import { _emscripten_glCreateShader } from './imports/_emscripten_glCreateShader'
import { _emscripten_glCullFace } from './imports/_emscripten_glCullFace'
import { _emscripten_glDeleteBuffers } from './imports/_emscripten_glDeleteBuffers'
import { _emscripten_glDeleteFramebuffers } from './imports/_emscripten_glDeleteFramebuffers'
import { _emscripten_glDeleteProgram } from './imports/_emscripten_glDeleteProgram'
import { _emscripten_glDeleteQueriesEXT } from './imports/_emscripten_glDeleteQueriesEXT'
import { _emscripten_glDeleteRenderbuffers } from './imports/_emscripten_glDeleteRenderbuffers'
import { _emscripten_glDeleteShader } from './imports/_emscripten_glDeleteShader'
import { _emscripten_glDeleteTextures } from './imports/_emscripten_glDeleteTextures'
import { _emscripten_glDeleteVertexArraysOES } from './imports/_emscripten_glDeleteVertexArraysOES'
import { _emscripten_glDepthFunc } from './imports/_emscripten_glDepthFunc'
import { _emscripten_glDepthMask } from './imports/_emscripten_glDepthMask'
import { _emscripten_glDepthRangef } from './imports/_emscripten_glDepthRangef'
import { _emscripten_glDetachShader } from './imports/_emscripten_glDetachShader'
import { _emscripten_glDisable } from './imports/_emscripten_glDisable'
import { _emscripten_glDisableVertexAttribArray } from './imports/_emscripten_glDisableVertexAttribArray'
import { _emscripten_glDrawArrays } from './imports/_emscripten_glDrawArrays'
import { _emscripten_glDrawArraysInstancedANGLE } from './imports/_emscripten_glDrawArraysInstancedANGLE'
import { _emscripten_glDrawBuffersWEBGL } from './imports/_emscripten_glDrawBuffersWEBGL'
import { _emscripten_glDrawElements } from './imports/_emscripten_glDrawElements'
import { _emscripten_glDrawElementsInstancedANGLE } from './imports/_emscripten_glDrawElementsInstancedANGLE'
import { _emscripten_glEnable } from './imports/_emscripten_glEnable'
import { _emscripten_glEnableVertexAttribArray } from './imports/_emscripten_glEnableVertexAttribArray'
import { _emscripten_glEndQueryEXT } from './imports/_emscripten_glEndQueryEXT'
import { _emscripten_glFinish } from './imports/_emscripten_glFinish'
import { _emscripten_glFlush } from './imports/_emscripten_glFlush'
import { _emscripten_glFramebufferRenderbuffer } from './imports/_emscripten_glFramebufferRenderbuffer'
import { _emscripten_glFramebufferTexture2D } from './imports/_emscripten_glFramebufferTexture2D'
import { _emscripten_glFrontFace } from './imports/_emscripten_glFrontFace'
import { _emscripten_glGenBuffers } from './imports/_emscripten_glGenBuffers'
import { _emscripten_glGenFramebuffers } from './imports/_emscripten_glGenFramebuffers'
import { _emscripten_glGenQueriesEXT } from './imports/_emscripten_glGenQueriesEXT'
import { _emscripten_glGenRenderbuffers } from './imports/_emscripten_glGenRenderbuffers'
import { _emscripten_glGenTextures } from './imports/_emscripten_glGenTextures'
import { _emscripten_glGenVertexArraysOES } from './imports/_emscripten_glGenVertexArraysOES'
import { _emscripten_glGenerateMipmap } from './imports/_emscripten_glGenerateMipmap'
import { _emscripten_glGetActiveAttrib } from './imports/_emscripten_glGetActiveAttrib'
import { _emscripten_glGetActiveUniform } from './imports/_emscripten_glGetActiveUniform'
import { _emscripten_glGetAttachedShaders } from './imports/_emscripten_glGetAttachedShaders'
import { _emscripten_glGetAttribLocation } from './imports/_emscripten_glGetAttribLocation'
import { _emscripten_glGetBooleanv } from './imports/_emscripten_glGetBooleanv'
import { _emscripten_glGetBufferParameteriv } from './imports/_emscripten_glGetBufferParameteriv'
import { _emscripten_glGetError } from './imports/_emscripten_glGetError'
import { _emscripten_glGetFloatv } from './imports/_emscripten_glGetFloatv'
import { _emscripten_glGetFramebufferAttachmentParameteriv } from './imports/_emscripten_glGetFramebufferAttachmentParameteriv'
import { _emscripten_glGetIntegerv } from './imports/_emscripten_glGetIntegerv'
import { _emscripten_glGetProgramInfoLog } from './imports/_emscripten_glGetProgramInfoLog'
import { _emscripten_glGetProgramiv } from './imports/_emscripten_glGetProgramiv'
import { _emscripten_glGetQueryObjecti64vEXT } from './imports/_emscripten_glGetQueryObjecti64vEXT'
import { _emscripten_glGetQueryObjectivEXT } from './imports/_emscripten_glGetQueryObjectivEXT'
import { _emscripten_glGetQueryObjectui64vEXT } from './imports/_emscripten_glGetQueryObjectui64vEXT'
import { _emscripten_glGetQueryObjectuivEXT } from './imports/_emscripten_glGetQueryObjectuivEXT'
import { _emscripten_glGetQueryivEXT } from './imports/_emscripten_glGetQueryivEXT'
import { _emscripten_glGetRenderbufferParameteriv } from './imports/_emscripten_glGetRenderbufferParameteriv'
import { _emscripten_glGetShaderInfoLog } from './imports/_emscripten_glGetShaderInfoLog'
import { _emscripten_glGetShaderPrecisionFormat } from './imports/_emscripten_glGetShaderPrecisionFormat'
import { _emscripten_glGetShaderSource } from './imports/_emscripten_glGetShaderSource'
import { _emscripten_glGetShaderiv } from './imports/_emscripten_glGetShaderiv'
import { _emscripten_glGetString } from './imports/_emscripten_glGetString'
import { _emscripten_glGetTexParameterfv } from './imports/_emscripten_glGetTexParameterfv'
import { _emscripten_glGetTexParameteriv } from './imports/_emscripten_glGetTexParameteriv'
import { _emscripten_glGetUniformLocation } from './imports/_emscripten_glGetUniformLocation'
import { _emscripten_glGetUniformfv } from './imports/_emscripten_glGetUniformfv'
import { _emscripten_glGetUniformiv } from './imports/_emscripten_glGetUniformiv'
import { _emscripten_glGetVertexAttribPointerv } from './imports/_emscripten_glGetVertexAttribPointerv'
import { _emscripten_glGetVertexAttribfv } from './imports/_emscripten_glGetVertexAttribfv'
import { _emscripten_glGetVertexAttribiv } from './imports/_emscripten_glGetVertexAttribiv'
import { _emscripten_glHint } from './imports/_emscripten_glHint'
import { _emscripten_glIsBuffer } from './imports/_emscripten_glIsBuffer'
import { _emscripten_glIsEnabled } from './imports/_emscripten_glIsEnabled'
import { _emscripten_glIsFramebuffer } from './imports/_emscripten_glIsFramebuffer'
import { _emscripten_glIsProgram } from './imports/_emscripten_glIsProgram'
import { _emscripten_glIsQueryEXT } from './imports/_emscripten_glIsQueryEXT'
import { _emscripten_glIsRenderbuffer } from './imports/_emscripten_glIsRenderbuffer'
import { _emscripten_glIsShader } from './imports/_emscripten_glIsShader'
import { _emscripten_glIsTexture } from './imports/_emscripten_glIsTexture'
import { _emscripten_glIsVertexArrayOES } from './imports/_emscripten_glIsVertexArrayOES'
import { _emscripten_glLineWidth } from './imports/_emscripten_glLineWidth'
import { _emscripten_glLinkProgram } from './imports/_emscripten_glLinkProgram'
import { _emscripten_glPixelStorei } from './imports/_emscripten_glPixelStorei'
import { _emscripten_glPolygonOffset } from './imports/_emscripten_glPolygonOffset'
import { _emscripten_glQueryCounterEXT } from './imports/_emscripten_glQueryCounterEXT'
import { _emscripten_glReadPixels } from './imports/_emscripten_glReadPixels'
import { _emscripten_glReleaseShaderCompiler } from './imports/_emscripten_glReleaseShaderCompiler'
import { _emscripten_glRenderbufferStorage } from './imports/_emscripten_glRenderbufferStorage'
import { _emscripten_glSampleCoverage } from './imports/_emscripten_glSampleCoverage'
import { _emscripten_glShaderBinary } from './imports/_emscripten_glShaderBinary'
import { _emscripten_glShaderSource } from './imports/_emscripten_glShaderSource'
import { _emscripten_glStencilFuncSeparate } from './imports/_emscripten_glStencilFuncSeparate'
import { _emscripten_glStencilFunc } from './imports/_emscripten_glStencilFunc'
import { _emscripten_glStencilMask } from './imports/_emscripten_glStencilMask'
import { _emscripten_glStencilMaskSeparate } from './imports/_emscripten_glStencilMaskSeparate'
import { _emscripten_glStencilOp } from './imports/_emscripten_glStencilOp'
import { _emscripten_glStencilOpSeparate } from './imports/_emscripten_glStencilOpSeparate'
import { _emscripten_glTexImage2D } from './imports/_emscripten_glTexImage2D'
import { _emscripten_glTexParameterf } from './imports/_emscripten_glTexParameterf'
import { _emscripten_glTexParameterfv } from './imports/_emscripten_glTexParameterfv'
import { _emscripten_glTexParameteri } from './imports/_emscripten_glTexParameteri'
import { _emscripten_glTexParameteriv } from './imports/_emscripten_glTexParameteriv'
import { _emscripten_glTexSubImage2D } from './imports/_emscripten_glTexSubImage2D'
import { _emscripten_glUniform1f } from './imports/_emscripten_glUniform1f'
import { _emscripten_glUniform1fv } from './imports/_emscripten_glUniform1fv'
import { _emscripten_glUniform1i } from './imports/_emscripten_glUniform1i'
import { _emscripten_glUniform1iv } from './imports/_emscripten_glUniform1iv'
import { _emscripten_glUniform2f } from './imports/_emscripten_glUniform2f'
import { _emscripten_glUniform2fv } from './imports/_emscripten_glUniform2fv'
import { _emscripten_glUniform2i } from './imports/_emscripten_glUniform2i'
import { _emscripten_glUniform2iv } from './imports/_emscripten_glUniform2iv'
import { _emscripten_glUniform3f } from './imports/_emscripten_glUniform3f'
import { _emscripten_glUniform3fv } from './imports/_emscripten_glUniform3fv'
import { _emscripten_glUniform3i } from './imports/_emscripten_glUniform3i'
import { _emscripten_glUniform3iv } from './imports/_emscripten_glUniform3iv'
import { _emscripten_glUniform4f } from './imports/_emscripten_glUniform4f'
import { _emscripten_glUniform4fv } from './imports/_emscripten_glUniform4fv'
import { _emscripten_glUniform4i } from './imports/_emscripten_glUniform4i'
import { _emscripten_glUniform4iv } from './imports/_emscripten_glUniform4iv'
import { _emscripten_glUniformMatrix2fv } from './imports/_emscripten_glUniformMatrix2fv'
import { _emscripten_glUniformMatrix3fv } from './imports/_emscripten_glUniformMatrix3fv'
import { _emscripten_glUniformMatrix4fv } from './imports/_emscripten_glUniformMatrix4fv'
import { _emscripten_glUseProgram } from './imports/_emscripten_glUseProgram'
import { _emscripten_glValidateProgram } from './imports/_emscripten_glValidateProgram'
import { _emscripten_glVertexAttrib1f } from './imports/_emscripten_glVertexAttrib1f'
import { _emscripten_glVertexAttrib1fv } from './imports/_emscripten_glVertexAttrib1fv'
import { _emscripten_glVertexAttrib2f } from './imports/_emscripten_glVertexAttrib2f'
import { _emscripten_glVertexAttrib2fv } from './imports/_emscripten_glVertexAttrib2fv'
import { _emscripten_glVertexAttrib3f } from './imports/_emscripten_glVertexAttrib3f'
import { _emscripten_glVertexAttrib3fv } from './imports/_emscripten_glVertexAttrib3fv'
import { _emscripten_glVertexAttrib4f } from './imports/_emscripten_glVertexAttrib4f'
import { _emscripten_glVertexAttrib4fv } from './imports/_emscripten_glVertexAttrib4fv'
import { _emscripten_glVertexAttribDivisorANGLE } from './imports/_emscripten_glVertexAttribDivisorANGLE'
import { _emscripten_glVertexAttribPointer } from './imports/_emscripten_glVertexAttribPointer'
import { _emscripten_glViewport } from './imports/_emscripten_glViewport'
import { _emscripten_memcpy_big } from './imports/_emscripten_memcpy_big'
import { _emscripten_resize_heap } from './imports/_emscripten_resize_heap'
import { _emscripten_thread_sleep } from './imports/_emscripten_thread_sleep'
import { _environ_get } from './imports/_environ_get'
import { _environ_sizes_get } from './imports/_environ_sizes_get'
import { _execve } from './imports/_execve'
import { _fd_close } from './imports/_fd_close'
import { _fd_fdstat_get } from './imports/_fd_fdstat_get'
import { _fd_pread } from './imports/_fd_pread'
import { _fd_pwrite } from './imports/_fd_pwrite'
import { _fd_read } from './imports/_fd_read'
import { _fd_seek } from './imports/_fd_seek'
import { _fd_sync } from './imports/_fd_sync'
import { _fd_write } from './imports/_fd_write'
import { _fork } from './imports/_fork'
import { getTempRet0 } from './imports/getTempRet0'
import { _getentropy } from './imports/_getentropy'
import { _getnameinfo } from './imports/_getnameinfo'
import { _gmtime_r } from './imports/_gmtime_r'
import { _proc_exit } from './imports/_proc_exit'
import { setTempRet0 } from './imports/setTempRet0'
import { _strftime } from './imports/_strftime'
import { _strftime_l } from './imports/_strftime_l'
import { _time } from './imports/_time'
import { __sys_getgid32 } from './imports/__sys_getgid32'
import { ___sys_mmap2 } from './imports/___sys_mmap2'
import { ___sys_getgid32 } from './imports/___sys_getgid32'
import { _emscripten_glScissor } from './imports/_emscripten_glScissor'
import { ___assert_fail } from './imports/___assert_fail'
import { _gettimeofday } from './imports/_gettimeofday'
import { _timegm } from './imports/_timegm'
import { _mktime } from './imports/_mktime'
import { _system } from './imports/_system'
import { _getaddrinfo } from './imports/_getaddrinfo'
import { _pthread_cancel } from './imports/_pthread_cancel'
import { _dladdr } from './imports/_dladdr'
import { _dlclose } from './imports/_dlclose'
import { _dlopen } from './imports/_dlopen'
import { _dlerror } from './imports/_dlerror'
import { _dlsym } from './imports/_dlsym'
import { _localtime_r } from './imports/_localtime_r'
import { _pclose } from './imports/_pclose'
import { _popen } from './imports/_popen'
import { _atexit } from './imports/_atexit'
import { _utimes } from './imports/_utimes'
import { ___cxa_thread_atexit } from './imports/___cxa_thread_atexit'
import { _emscripten_get_now } from './imports/_emscripten_get_now'
import { _emscripten_conditional_set_current_thread_status } from './imports/_emscripten_conditional_set_current_thread_status'
import { _emscripten_futex_wait } from './imports/_emscripten_futex_wait'
import { _emscripten_futex_wake } from './imports/_emscripten_futex_wake'
import { _emscripten_num_logical_cores } from './imports/_emscripten_num_logical_cores'
import { _emscripten_receive_on_main_thread_js } from './imports/_emscripten_receive_on_main_thread_js'
import { _emscripten_set_canvas_element_size } from './imports/_emscripten_set_canvas_element_size'
import { _emscripten_set_current_thread_status } from './imports/_emscripten_set_current_thread_status'
import { _emscripten_set_thread_name } from './imports/_emscripten_set_thread_name'
import { _emscripten_set_timeout } from './imports/_emscripten_set_timeout'
import { _emscripten_unwind_to_js_event_loop } from './imports/_emscripten_unwind_to_js_event_loop'
import { _emscripten_webgl_create_context } from './imports/_emscripten_webgl_create_context'
import { __emscripten_notify_thread_queue } from './imports/__emscripten_notify_thread_queue'
import { ___pthread_create_js } from './imports/___pthread_create_js'
import { ___pthread_detached_exit } from './imports/___pthread_detached_exit'
import { ___pthread_exit_run_handlers } from './imports/___pthread_exit_run_handlers'
import { ___pthread_join_js } from './imports/___pthread_join_js'
import { ___emscripten_init_main_thread_js } from './imports/___emscripten_init_main_thread_js'
import { ___call_main } from './imports/___call_main'
import { _emscripten_check_blocking_allowed } from './imports/_emscripten_check_blocking_allowed'
import { _emscripten_cancel_main_loop } from './imports/_emscripten_cancel_main_loop'
import { _emscripten_force_exit } from './imports/_emscripten_force_exit'
import { _emscripten_get_element_css_size } from './imports/_emscripten_get_element_css_size'
import { _emscripten_set_mousedown_callback_on_thread } from './imports/_emscripten_set_mousedown_callback_on_thread'
import { _emscripten_set_mouseenter_callback_on_thread } from './imports/_emscripten_set_mouseenter_callback_on_thread'
import { _emscripten_set_mouseleave_callback_on_thread } from './imports/_emscripten_set_mouseleave_callback_on_thread'
import { _emscripten_set_mousemove_callback_on_thread } from './imports/_emscripten_set_mousemove_callback_on_thread'
import { _emscripten_set_mouseup_callback_on_thread } from './imports/_emscripten_set_mouseup_callback_on_thread'
import { _emscripten_set_pointerlockchange_callback_on_thread } from './imports/_emscripten_set_pointerlockchange_callback_on_thread'
import { _emscripten_set_resize_callback_on_thread } from './imports/_emscripten_set_resize_callback_on_thread'
import { _emscripten_set_touchcancel_callback_on_thread } from './imports/_emscripten_set_touchcancel_callback_on_thread'
import { _emscripten_set_touchend_callback_on_thread } from './imports/_emscripten_set_touchend_callback_on_thread'
import { _emscripten_set_touchmove_callback_on_thread } from './imports/_emscripten_set_touchmove_callback_on_thread'
import { _emscripten_set_touchstart_callback_on_thread } from './imports/_emscripten_set_touchstart_callback_on_thread'
import { _emscripten_set_visibilitychange_callback_on_thread } from './imports/_emscripten_set_visibilitychange_callback_on_thread'
import { _emscripten_set_wheel_callback_on_thread } from './imports/_emscripten_set_wheel_callback_on_thread'
import { _emscripten_set_focus_callback_on_thread } from './imports/_emscripten_set_focus_callback_on_thread'
import { _emscripten_set_fullscreenchange_callback_on_thread } from './imports/_emscripten_set_fullscreenchange_callback_on_thread'
import { _emscripten_set_gamepadconnected_callback_on_thread } from './imports/_emscripten_set_gamepadconnected_callback_on_thread'
import { _emscripten_set_gamepaddisconnected_callback_on_thread } from './imports/_emscripten_set_gamepaddisconnected_callback_on_thread'
import { _emscripten_set_keydown_callback_on_thread } from './imports/_emscripten_set_keydown_callback_on_thread'
import { _emscripten_set_keypress_callback_on_thread } from './imports/_emscripten_set_keypress_callback_on_thread'
import { _emscripten_set_keyup_callback_on_thread } from './imports/_emscripten_set_keyup_callback_on_thread'
import { _emscripten_set_blur_callback_on_thread } from './imports/_emscripten_set_blur_callback_on_thread'
import { _emscripten_sample_gamepad_data } from './imports/_emscripten_sample_gamepad_data'
import { _emscripten_set_beforeunload_callback_on_thread } from './imports/_emscripten_set_beforeunload_callback_on_thread'
import { _emscripten_request_fullscreen_strategy } from './imports/_emscripten_request_fullscreen_strategy'
import { _emscripten_request_pointerlock } from './imports/_emscripten_request_pointerlock'
import { _emscripten_get_device_pixel_ratio } from './imports/_emscripten_get_device_pixel_ratio'
import { _emscripten_set_element_css_size } from './imports/_emscripten_set_element_css_size'
import { _emscripten_has_asyncify } from './imports/_emscripten_has_asyncify'
import { _emscripten_sleep } from './imports/_emscripten_sleep'
import { _emscripten_exit_fullscreen } from './imports/_emscripten_exit_fullscreen'
import { _emscripten_exit_pointerlock } from './imports/_emscripten_exit_pointerlock'
import { _eglBindAPI } from './imports/_eglBindAPI'
import { _eglChooseConfig } from './imports/_eglChooseConfig'
import { _eglCreateContext } from './imports/_eglCreateContext'
import { _eglCreateWindowSurface } from './imports/_eglCreateWindowSurface'
import { _eglDestroyContext } from './imports/_eglDestroyContext'
import { _eglDestroySurface } from './imports/_eglDestroySurface'
import { _eglGetDisplay } from './imports/_eglGetDisplay'
import { _eglGetError } from './imports/_eglGetError'
import { _eglInitialize } from './imports/_eglInitialize'
import { _eglMakeCurrent } from './imports/_eglMakeCurrent'
import { _eglQueryString } from './imports/_eglQueryString'
import { _eglSwapBuffers } from './imports/_eglSwapBuffers'
import { _eglSwapInterval } from './imports/_eglSwapInterval'
import { _eglTerminate } from './imports/_eglTerminate'
import { _eglWaitGL } from './imports/_eglWaitGL'
import { _eglWaitNative } from './imports/_eglWaitNative'
import { _eglGetConfigAttrib } from './imports/_eglGetConfigAttrib'
import { _emscripten_get_battery_status } from './imports/_emscripten_get_battery_status'
import { _emscripten_get_num_gamepads } from './imports/_emscripten_get_num_gamepads'
import { _emscripten_get_gamepad_status } from './imports/_emscripten_get_gamepad_status'


const asmLibraryArg: WebAssembly.ModuleImports = {
    "__asctime": ___asctime,
    "__assert_fail": ___assert_fail,
    "__call_sighandler": ___call_sighandler,
    "__clock_gettime": ___clock_gettime,
    "__cxa_thread_atexit": ___cxa_thread_atexit,
    "__cxa_atexit": ___cxa_atexit,
    "__gmtime_r": ___gmtime_r,
    "__heap_base": ___heap_base,
    "__localtime_r": ___localtime_r,
    "__map_file": ___map_file,
    "__memory_base": ___memory_base,
    "__stack_pointer": ___stack_pointer,
    "__sys__newselect": ___sys__newselect,
    "__sys_accept4": ___sys_accept4,
    "__sys_access": ___sys_access,
    "__sys_acct": ___sys_acct,
    "__sys_bind": ___sys_bind,
    "__sys_chdir": ___sys_chdir,
    "__sys_chmod": ___sys_chmod,
    "__sys_chown32": ___sys_chown32,
    "__sys_connect": ___sys_connect,
    "__sys_dup": ___sys_dup,
    "__sys_dup2": ___sys_dup2,
    "__sys_dup3": ___sys_dup3,
    "__sys_fadvise64_64": ___sys_fadvise64_64,
    "__sys_fallocate": ___sys_fallocate,
    "__sys_fchdir": ___sys_fchdir,
    "__sys_fchmod": ___sys_fchmod,
    "__sys_fchmodat": ___sys_fchmodat,
    "__sys_fchown32": ___sys_fchown32,
    "__sys_fchownat": ___sys_fchownat,
    "__sys_fcntl64": ___sys_fcntl64,
    "__sys_fdatasync": ___sys_fdatasync,
    "__sys_fstat64": ___sys_fstat64,
    "__sys_fstatat64": ___sys_fstatat64,
    "__sys_fstatfs64": ___sys_fstatfs64,
    "__sys_ftruncate64": ___sys_ftruncate64,
    "__sys_getcwd": ___sys_getcwd,
    "__sys_getdents64": ___sys_getdents64,
    "__sys_getegid32": ___sys_getegid32,
    "__sys_geteuid32": ___sys_geteuid32,
    "__sys_getgid32": ___sys_getgid32,
    "__sys_getgroups32": ___sys_getgroups32,
    "__sys_getitimer": ___sys_getitimer,
    "__sys_getpeername": ___sys_getpeername,
    "__sys_getpgid": ___sys_getpgid,
    "__sys_getpid": ___sys_getpid,
    "__sys_getppid": ___sys_getppid,
    "__sys_getpriority": ___sys_getpriority,
    "__sys_getresgid32": ___sys_getresgid32,
    "__sys_getresuid32": ___sys_getresuid32,
    "__sys_getrusage": ___sys_getrusage,
    "__sys_getsid": ___sys_getsid,
    "__sys_getsockname": ___sys_getsockname,
    "__sys_getsockopt": ___sys_getsockopt,
    "__sys_getuid32": ___sys_getuid32,
    "__sys_ioctl": ___sys_ioctl,
    "__sys_lchown32": ___sys_lchown32,
    "__sys_link": ___sys_link,
    "__sys_linkat": ___sys_linkat,
    "__sys_listen": ___sys_listen,
    "__sys_lstat64": ___sys_lstat64,
    "__sys_madvise1": ___sys_madvise1,
    "__sys_mincore": ___sys_mincore,
    "__sys_mkdir": ___sys_mkdir,
    "__sys_mkdirat": ___sys_mkdirat,
    "__sys_mknod": ___sys_mknod,
    "__sys_mknodat": ___sys_mknodat,
    "__sys_mlock": ___sys_mlock,
    "__sys_mlockall": ___sys_mlockall,
    "__sys_mmap2": ___sys_mmap2,
    "__sys_mprotect": ___sys_mprotect,
    "__sys_mremap": ___sys_mremap,
    "__sys_msync": ___sys_msync,
    "__sys_munlock": ___sys_munlock,
    "__sys_munlockall": ___sys_munlockall,
    "__sys_munmap": ___sys_munmap,
    "__sys_nice": ___sys_nice,
    "__sys_open": ___sys_open,
    "__sys_openat": ___sys_openat,
    "__sys_pause": ___sys_pause,
    "__sys_pipe": ___sys_pipe,
    "__sys_pipe2": ___sys_pipe2,
    "__sys_poll": ___sys_poll,
    "__sys_prlimit64": ___sys_prlimit64,
    "__sys_pselect6": ___sys_pselect6,
    "__sys_readlink": ___sys_readlink,
    "__sys_readlinkat": ___sys_readlinkat,
    "__sys_recvfrom": ___sys_recvfrom,
    "__sys_recvmmsg": ___sys_recvmmsg,
    "__sys_recvmsg": ___sys_recvmsg,
    "__sys_rename": ___sys_rename,
    "__sys_renameat": ___sys_renameat,
    "__sys_rmdir": ___sys_rmdir,
    "__sys_sendmmsg": ___sys_sendmmsg,
    "__sys_sendmsg": ___sys_sendmsg,
    "__sys_sendto": ___sys_sendto,
    "__sys_setdomainname": ___sys_setdomainname,
    "__sys_setitimer": ___sys_setitimer,
    "__sys_setpgid": ___sys_setpgid,
    "__sys_setpriority": ___sys_setpriority,
    "__sys_setrlimit": ___sys_setrlimit,
    "__sys_setsid": ___sys_setsid,
    "__sys_setsockopt": ___sys_setsockopt,
    "__sys_shutdown": ___sys_shutdown,
    "__sys_socket": ___sys_socket,
    "__sys_socketpair": ___sys_socketpair,
    "__sys_stat64": ___sys_stat64,
    "__sys_statfs64": ___sys_statfs64,
    "__sys_symlink": ___sys_symlink,
    "__sys_symlinkat": ___sys_symlinkat,
    "__sys_sync": ___sys_sync,
    "__sys_truncate64": ___sys_truncate64,
    "__sys_ugetrlimit": ___sys_ugetrlimit,
    "__sys_umask": ___sys_umask,
    "__sys_uname": ___sys_uname,
    "__sys_unlink": ___sys_unlink,
    "__sys_unlinkat": ___sys_unlinkat,
    "__sys_utimensat": ___sys_utimensat,
    "__sys_wait4": ___sys_wait4,
    "__table_base": ___table_base,
    "_emscripten_notify_thread_queue": __emscripten_notify_thread_queue,
    "_emscripten_throw_longjmp": __emscripten_throw_longjmp,
    "emscripten_cancel_main_loop": _emscripten_cancel_main_loop,
    "emscripten_get_element_css_size": _emscripten_get_element_css_size,
    "emscripten_set_mousedown_callback_on_thread": _emscripten_set_mousedown_callback_on_thread,
    "emscripten_set_mouseenter_callback_on_thread": _emscripten_set_mouseenter_callback_on_thread,
    "emscripten_set_mouseleave_callback_on_thread": _emscripten_set_mouseleave_callback_on_thread,
    "emscripten_set_mousemove_callback_on_thread": _emscripten_set_mousemove_callback_on_thread,
    "emscripten_set_mouseup_callback_on_thread": _emscripten_set_mouseup_callback_on_thread,
    "emscripten_set_pointerlockchange_callback_on_thread": _emscripten_set_pointerlockchange_callback_on_thread,
    "emscripten_set_resize_callback_on_thread": _emscripten_set_resize_callback_on_thread,
    "emscripten_set_thread_name": _emscripten_set_thread_name,
    "emscripten_set_timeout": _emscripten_set_timeout,
    "emscripten_set_touchcancel_callback_on_thread": _emscripten_set_touchcancel_callback_on_thread,
    "emscripten_set_touchend_callback_on_thread": _emscripten_set_touchend_callback_on_thread,
    "emscripten_set_touchmove_callback_on_thread": _emscripten_set_touchmove_callback_on_thread,
    "emscripten_set_touchstart_callback_on_thread": _emscripten_set_touchstart_callback_on_thread,
    "emscripten_set_visibilitychange_callback_on_thread": _emscripten_set_visibilitychange_callback_on_thread,
    "emscripten_set_wheel_callback_on_thread": _emscripten_set_wheel_callback_on_thread,
    "abort": _abort,
    "alBuffer3f": _alBuffer3f,
    "alBuffer3i": _alBuffer3i,
    "alBufferData": _alBufferData,
    "alBufferf": _alBufferf,
    "alBufferfv": _alBufferfv,
    "alBufferi": _alBufferi,
    "alBufferiv": _alBufferiv,
    "alDeleteBuffers": _alDeleteBuffers,
    "alDeleteSources": _alDeleteSources,
    "alDisable": _alDisable,
    "alDistanceModel": _alDistanceModel,
    "alDopplerFactor": _alDopplerFactor,
    "alDopplerVelocity": _alDopplerVelocity,
    "alEnable": _alEnable,
    "alGenBuffers": _alGenBuffers,
    "alGenSources": _alGenSources,
    "alGetBoolean": _alGetBoolean,
    "alGetBooleanv": _alGetBooleanv,
    "alGetBuffer3f": _alGetBuffer3f,
    "alGetBuffer3i": _alGetBuffer3i,
    "alGetBufferf": _alGetBufferf,
    "alGetBufferfv": _alGetBufferfv,
    "alGetBufferi": _alGetBufferi,
    "alGetBufferiv": _alGetBufferiv,
    "alGetDouble": _alGetDouble,
    "alGetDoublev": _alGetDoublev,
    "alGetEnumValue": _alGetEnumValue,
    "alGetError": _alGetError,
    "alGetFloat": _alGetFloat,
    "alGetFloatv": _alGetFloatv,
    "alGetInteger": _alGetInteger,
    "alGetIntegerv": _alGetIntegerv,
    "alGetListener3f": _alGetListener3f,
    "alGetListener3i": _alGetListener3i,
    "alGetListenerf": _alGetListenerf,
    "alGetListenerfv": _alGetListenerfv,
    "alGetListeneri": _alGetListeneri,
    "alGetListeneriv": _alGetListeneriv,
    "alGetSource3f": _alGetSource3f,
    "alGetSource3i": _alGetSource3i,
    "alGetSourcef": _alGetSourcef,
    "alGetSourcefv": _alGetSourcefv,
    "alGetSourcei": _alGetSourcei,
    "alGetSourceiv": _alGetSourceiv,
    "alGetString": _alGetString,
    "alIsBuffer": _alIsBuffer,
    "alIsEnabled": _alIsEnabled,
    "alIsExtensionPresent": _alIsExtensionPresent,
    "alIsSource": _alIsSource,
    "alListener3f": _alListener3f,
    "alListener3i": _alListener3i,
    "alListenerf": _alListenerf,
    "alListenerfv": _alListenerfv,
    "alListeneri": _alListeneri,
    "alListeneriv": _alListeneriv,
    "alSource3f": _alSource3f,
    "alSource3i": _alSource3i,
    "alSourcePause": _alSourcePause,
    "alSourcePausev": _alSourcePausev,
    "alSourcePlay": _alSourcePlay,
    "alSourcePlayv": _alSourcePlayv,
    "alSourceQueueBuffers": _alSourceQueueBuffers,
    "alSourceRewind": _alSourceRewind,
    "alSourceRewindv": _alSourceRewindv,
    "alSourceStop": _alSourceStop,
    "alSourceStopv": _alSourceStopv,
    "alSourceUnqueueBuffers": _alSourceUnqueueBuffers,
    "alSourcef": _alSourcef,
    "alSourcefv": _alSourcefv,
    "alSourcei": _alSourcei,
    "alSourceiv": _alSourceiv,
    "alSpeedOfSound": _alSpeedOfSound,
    "alcCaptureCloseDevice": _alcCaptureCloseDevice,
    "alcCaptureOpenDevice": _alcCaptureOpenDevice,
    "alcCaptureSamples": _alcCaptureSamples,
    "alcCaptureStart": _alcCaptureStart,
    "alcCaptureStop": _alcCaptureStop,
    "alcCloseDevice": _alcCloseDevice,
    "alcCreateContext": _alcCreateContext,
    "alcDestroyContext": _alcDestroyContext,
    "alcGetContextsDevice": _alcGetContextsDevice,
    "alcGetCurrentContext": _alcGetCurrentContext,
    "alcGetEnumValue": _alcGetEnumValue,
    "alcGetError": _alcGetError,
    "alcGetIntegerv": _alcGetIntegerv,
    "alcGetString": _alcGetString,
    "alcIsExtensionPresent": _alcIsExtensionPresent,
    "alcMakeContextCurrent": _alcMakeContextCurrent,
    "alcOpenDevice": _alcOpenDevice,
    "alcProcessContext": _alcProcessContext,
    "alcSuspendContext": _alcSuspendContext,
    "clock_gettime": _clock_gettime,
    "emscripten_get_now": _emscripten_get_now,
    "emscripten_force_exit": _emscripten_force_exit,
    "emscripten_conditional_set_current_thread_status": _emscripten_conditional_set_current_thread_status,
    "emscripten_futex_wait": _emscripten_futex_wait,
    "emscripten_futex_wake": _emscripten_futex_wake,
    "emscripten_alcDevicePauseSOFT": _emscripten_alcDevicePauseSOFT,
    "emscripten_alcDeviceResumeSOFT": _emscripten_alcDeviceResumeSOFT,
    "emscripten_alcGetStringiSOFT": _emscripten_alcGetStringiSOFT,
    "emscripten_alcResetDeviceSOFT": _emscripten_alcResetDeviceSOFT,
    "emscripten_asm_const_int": _emscripten_asm_const_int,
    "emscripten_get_heap_max": _emscripten_get_heap_max,
    "emscripten_glActiveTexture": _emscripten_glActiveTexture,
    "emscripten_glAttachShader": _emscripten_glAttachShader,
    "emscripten_glBeginQueryEXT": _emscripten_glBeginQueryEXT,
    "emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation,
    "emscripten_glBindBuffer": _emscripten_glBindBuffer,
    "emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer,
    "emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer,
    "emscripten_glBindTexture": _emscripten_glBindTexture,
    "emscripten_glBindVertexArrayOES": _emscripten_glBindVertexArrayOES,
    "emscripten_glBlendColor": _emscripten_glBlendColor,
    "emscripten_glBlendEquation": _emscripten_glBlendEquation,
    "emscripten_glBlendEquationSeparate": _emscripten_glBlendEquationSeparate,
    "emscripten_glBlendFunc": _emscripten_glBlendFunc,
    "emscripten_glBlendFuncSeparate": _emscripten_glBlendFuncSeparate,
    "emscripten_glBufferData": _emscripten_glBufferData,
    "emscripten_glBufferSubData": _emscripten_glBufferSubData,
    "emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus,
    "emscripten_glClear": _emscripten_glClear,
    "emscripten_glClearColor": _emscripten_glClearColor,
    "emscripten_glClearDepthf": _emscripten_glClearDepthf,
    "emscripten_glClearStencil": _emscripten_glClearStencil,
    "emscripten_glColorMask": _emscripten_glColorMask,
    "emscripten_glCompileShader": _emscripten_glCompileShader,
    "emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D,
    "emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D,
    "emscripten_glCopyTexImage2D": _emscripten_glCopyTexImage2D,
    "emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D,
    "emscripten_glCreateProgram": _emscripten_glCreateProgram,
    "emscripten_glCreateShader": _emscripten_glCreateShader,
    "emscripten_glCullFace": _emscripten_glCullFace,
    "emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers,
    "emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers,
    "emscripten_glDeleteProgram": _emscripten_glDeleteProgram,
    "emscripten_glDeleteQueriesEXT": _emscripten_glDeleteQueriesEXT,
    "emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers,
    "emscripten_glDeleteShader": _emscripten_glDeleteShader,
    "emscripten_glDeleteTextures": _emscripten_glDeleteTextures,
    "emscripten_glDeleteVertexArraysOES": _emscripten_glDeleteVertexArraysOES,
    "emscripten_glDepthFunc": _emscripten_glDepthFunc,
    "emscripten_glDepthMask": _emscripten_glDepthMask,
    "emscripten_glDepthRangef": _emscripten_glDepthRangef,
    "emscripten_glDetachShader": _emscripten_glDetachShader,
    "emscripten_glDisable": _emscripten_glDisable,
    "emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray,
    "emscripten_glDrawArrays": _emscripten_glDrawArrays,
    "emscripten_glDrawArraysInstancedANGLE": _emscripten_glDrawArraysInstancedANGLE,
    "emscripten_glDrawBuffersWEBGL": _emscripten_glDrawBuffersWEBGL,
    "emscripten_glDrawElements": _emscripten_glDrawElements,
    "emscripten_glDrawElementsInstancedANGLE": _emscripten_glDrawElementsInstancedANGLE,
    "emscripten_glEnable": _emscripten_glEnable,
    "emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray,
    "emscripten_glEndQueryEXT": _emscripten_glEndQueryEXT,
    "emscripten_glFinish": _emscripten_glFinish,
    "emscripten_glFlush": _emscripten_glFlush,
    "emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer,
    "emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D,
    "emscripten_glFrontFace": _emscripten_glFrontFace,
    "emscripten_glGenBuffers": _emscripten_glGenBuffers,
    "emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers,
    "emscripten_glGenQueriesEXT": _emscripten_glGenQueriesEXT,
    "emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers,
    "emscripten_glGenTextures": _emscripten_glGenTextures,
    "emscripten_glGenVertexArraysOES": _emscripten_glGenVertexArraysOES,
    "emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap,
    "emscripten_glGetActiveAttrib": _emscripten_glGetActiveAttrib,
    "emscripten_glGetActiveUniform": _emscripten_glGetActiveUniform,
    "emscripten_glGetAttachedShaders": _emscripten_glGetAttachedShaders,
    "emscripten_glGetAttribLocation": _emscripten_glGetAttribLocation,
    "emscripten_glGetBooleanv": _emscripten_glGetBooleanv,
    "emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv,
    "emscripten_glGetError": _emscripten_glGetError,
    "emscripten_glGetFloatv": _emscripten_glGetFloatv,
    "emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv,
    "emscripten_glGetIntegerv": _emscripten_glGetIntegerv,
    "emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog,
    "emscripten_glGetProgramiv": _emscripten_glGetProgramiv,
    "emscripten_glGetQueryObjecti64vEXT": _emscripten_glGetQueryObjecti64vEXT,
    "emscripten_glGetQueryObjectivEXT": _emscripten_glGetQueryObjectivEXT,
    "emscripten_glGetQueryObjectui64vEXT": _emscripten_glGetQueryObjectui64vEXT,
    "emscripten_glGetQueryObjectuivEXT": _emscripten_glGetQueryObjectuivEXT,
    "emscripten_glGetQueryivEXT": _emscripten_glGetQueryivEXT,
    "emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv,
    "emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog,
    "emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat,
    "emscripten_glGetShaderSource": _emscripten_glGetShaderSource,
    "emscripten_glGetShaderiv": _emscripten_glGetShaderiv,
    "emscripten_glGetString": _emscripten_glGetString,
    "emscripten_glGetTexParameterfv": _emscripten_glGetTexParameterfv,
    "emscripten_glGetTexParameteriv": _emscripten_glGetTexParameteriv,
    "emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation,
    "emscripten_glGetUniformfv": _emscripten_glGetUniformfv,
    "emscripten_glGetUniformiv": _emscripten_glGetUniformiv,
    "emscripten_glGetVertexAttribPointerv": _emscripten_glGetVertexAttribPointerv,
    "emscripten_glGetVertexAttribfv": _emscripten_glGetVertexAttribfv,
    "emscripten_glGetVertexAttribiv": _emscripten_glGetVertexAttribiv,
    "emscripten_glHint": _emscripten_glHint,
    "emscripten_glIsBuffer": _emscripten_glIsBuffer,
    "emscripten_glIsEnabled": _emscripten_glIsEnabled,
    "emscripten_glIsFramebuffer": _emscripten_glIsFramebuffer,
    "emscripten_glIsProgram": _emscripten_glIsProgram,
    "emscripten_glIsQueryEXT": _emscripten_glIsQueryEXT,
    "emscripten_glIsRenderbuffer": _emscripten_glIsRenderbuffer,
    "emscripten_glIsShader": _emscripten_glIsShader,
    "emscripten_glIsTexture": _emscripten_glIsTexture,
    "emscripten_glIsVertexArrayOES": _emscripten_glIsVertexArrayOES,
    "emscripten_glLineWidth": _emscripten_glLineWidth,
    "emscripten_glLinkProgram": _emscripten_glLinkProgram,
    "emscripten_glPixelStorei": _emscripten_glPixelStorei,
    "emscripten_glPolygonOffset": _emscripten_glPolygonOffset,
    "emscripten_glQueryCounterEXT": _emscripten_glQueryCounterEXT,
    "emscripten_glReadPixels": _emscripten_glReadPixels,
    "emscripten_glReleaseShaderCompiler": _emscripten_glReleaseShaderCompiler,
    "emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage,
    "emscripten_glSampleCoverage": _emscripten_glSampleCoverage,
    "emscripten_glScissor": _emscripten_glScissor,
    "emscripten_glShaderBinary": _emscripten_glShaderBinary,
    "emscripten_glShaderSource": _emscripten_glShaderSource,
    "emscripten_glStencilFunc": _emscripten_glStencilFunc,
    "emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate,
    "emscripten_glStencilMask": _emscripten_glStencilMask,
    "emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate,
    "emscripten_glStencilOp": _emscripten_glStencilOp,
    "emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate,
    "emscripten_glTexImage2D": _emscripten_glTexImage2D,
    "emscripten_glTexParameterf": _emscripten_glTexParameterf,
    "emscripten_glTexParameterfv": _emscripten_glTexParameterfv,
    "emscripten_glTexParameteri": _emscripten_glTexParameteri,
    "emscripten_glTexParameteriv": _emscripten_glTexParameteriv,
    "emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D,
    "emscripten_glUniform1f": _emscripten_glUniform1f,
    "emscripten_glUniform1fv": _emscripten_glUniform1fv,
    "emscripten_glUniform1i": _emscripten_glUniform1i,
    "emscripten_glUniform1iv": _emscripten_glUniform1iv,
    "emscripten_glUniform2f": _emscripten_glUniform2f,
    "emscripten_glUniform2fv": _emscripten_glUniform2fv,
    "emscripten_glUniform2i": _emscripten_glUniform2i,
    "emscripten_glUniform2iv": _emscripten_glUniform2iv,
    "emscripten_glUniform3f": _emscripten_glUniform3f,
    "emscripten_glUniform3fv": _emscripten_glUniform3fv,
    "emscripten_glUniform3i": _emscripten_glUniform3i,
    "emscripten_glUniform3iv": _emscripten_glUniform3iv,
    "emscripten_glUniform4f": _emscripten_glUniform4f,
    "emscripten_glUniform4fv": _emscripten_glUniform4fv,
    "emscripten_glUniform4i": _emscripten_glUniform4i,
    "emscripten_glUniform4iv": _emscripten_glUniform4iv,
    "emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv,
    "emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv,
    "emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv,
    "emscripten_glUseProgram": _emscripten_glUseProgram,
    "emscripten_glValidateProgram": _emscripten_glValidateProgram,
    "emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f,
    "emscripten_glVertexAttrib1fv": _emscripten_glVertexAttrib1fv,
    "emscripten_glVertexAttrib2f": _emscripten_glVertexAttrib2f,
    "emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv,
    "emscripten_glVertexAttrib3f": _emscripten_glVertexAttrib3f,
    "emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv,
    "emscripten_glVertexAttrib4f": _emscripten_glVertexAttrib4f,
    "emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv,
    "emscripten_glVertexAttribDivisorANGLE": _emscripten_glVertexAttribDivisorANGLE,
    "emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer,
    "emscripten_glViewport": _emscripten_glViewport,
    "emscripten_memcpy_big": _emscripten_memcpy_big,
    "emscripten_resize_heap": _emscripten_resize_heap,
    "emscripten_thread_sleep": _emscripten_thread_sleep,
    "emscripten_sample_gamepad_data": _emscripten_sample_gamepad_data,
    "emscripten_set_beforeunload_callback_on_thread": _emscripten_set_beforeunload_callback_on_thread,
    "emscripten_set_focus_callback_on_thread": _emscripten_set_focus_callback_on_thread,
    "emscripten_set_fullscreenchange_callback_on_thread": _emscripten_set_fullscreenchange_callback_on_thread,
    "emscripten_set_gamepadconnected_callback_on_thread": _emscripten_set_gamepadconnected_callback_on_thread,
    "emscripten_set_gamepaddisconnected_callback_on_thread": _emscripten_set_gamepaddisconnected_callback_on_thread,
    "emscripten_set_keydown_callback_on_thread": _emscripten_set_keydown_callback_on_thread,
    "emscripten_set_keypress_callback_on_thread": _emscripten_set_keypress_callback_on_thread,
    "emscripten_set_keyup_callback_on_thread": _emscripten_set_keyup_callback_on_thread,
    "emscripten_set_blur_callback_on_thread": _emscripten_set_blur_callback_on_thread,
    "environ_get": _environ_get,
    "environ_sizes_get": _environ_sizes_get,
    "execve": _execve,
    "exit": _exit,
    "fd_close": _fd_close,
    "fd_fdstat_get": _fd_fdstat_get,
    "fd_pread": _fd_pread,
    "fd_pwrite": _fd_pwrite,
    "fd_read": _fd_read,
    "fd_seek": _fd_seek,
    "fd_sync": _fd_sync,
    "fd_write": _fd_write,
    "fork": _fork,
    "getTempRet0": getTempRet0,
    "getentropy": _getentropy,
    "getnameinfo": _getnameinfo,
    "gmtime_r": _gmtime_r,
    "proc_exit": _proc_exit,
    "setTempRet0": setTempRet0,
    "strftime": _strftime,
    "strftime_l": _strftime_l,
    "time": _time,
    "gettimeofday": _gettimeofday,
    "timegm": _timegm,
    "mktime": _mktime,
    "system": _system,
    "getaddrinfo": _getaddrinfo,
    "pthread_cancel": _pthread_cancel,
    "dladdr": _dladdr,
    "dlclose": _dlclose,
    "dlopen": _dlopen,
    "dlerror": _dlerror,
    "dlsym": _dlsym,
    "localtime_r": _localtime_r,
    "pclose": _pclose,
    "popen": _popen,
    "atexit": _atexit,
    "utimes": _utimes,
    "emscripten_num_logical_cores": _emscripten_num_logical_cores,
    "emscripten_receive_on_main_thread_js": _emscripten_receive_on_main_thread_js,
    "emscripten_set_canvas_element_size": _emscripten_set_canvas_element_size,
    "emscripten_set_current_thread_status": _emscripten_set_current_thread_status,
    "emscripten_unwind_to_js_event_loop": _emscripten_unwind_to_js_event_loop,
    "emscripten_webgl_create_context": _emscripten_webgl_create_context,
    "__pthread_create_js": ___pthread_create_js,
    "__pthread_detached_exit": ___pthread_detached_exit,
    "__pthread_exit_run_handlers": ___pthread_exit_run_handlers,
    "__pthread_join_js": ___pthread_join_js,
    "__emscripten_init_main_thread_js": ___emscripten_init_main_thread_js,
    "__call_main": ___call_main,
    "emscripten_check_blocking_allowed": _emscripten_check_blocking_allowed,
    "emscripten_request_fullscreen_strategy": _emscripten_request_fullscreen_strategy,
    "emscripten_request_pointerlock": _emscripten_request_pointerlock,
    "emscripten_get_device_pixel_ratio": _emscripten_get_device_pixel_ratio,
    "emscripten_set_element_css_size": _emscripten_set_element_css_size,
    "emscripten_has_asyncify": _emscripten_has_asyncify,
    "emscripten_sleep": _emscripten_sleep,
    "emscripten_exit_fullscreen": _emscripten_exit_fullscreen,
    "emscripten_exit_pointerlock": _emscripten_exit_pointerlock,
    "eglBindAPI": _eglBindAPI,
    "eglChooseConfig": _eglChooseConfig,
    "eglCreateContext": _eglCreateContext,
    "eglCreateWindowSurface": _eglCreateWindowSurface,
    "eglDestroyContext": _eglDestroyContext,
    "eglDestroySurface": _eglDestroySurface,
    "eglGetConfigAttrib": _eglGetConfigAttrib,
    "eglGetDisplay": _eglGetDisplay,
    "eglGetError": _eglGetError,
    "eglInitialize": _eglInitialize,
    "eglMakeCurrent": _eglMakeCurrent,
    "eglQueryString": _eglQueryString,
    "eglSwapBuffers": _eglSwapBuffers,
    "eglSwapInterval": _eglSwapInterval,
    "eglTerminate": _eglTerminate,
    "eglWaitGL": _eglWaitGL,
    "eglWaitNative": _eglWaitNative,
    "emscripten_get_battery_status": _emscripten_get_battery_status,
    "emscripten_get_num_gamepads": _emscripten_get_num_gamepads,
    "emscripten_get_gamepad_status": _emscripten_get_gamepad_status,
};

const GOT: Record<string, WebAssembly.Global> = {};

const GOTHandler: WebAssembly.ModuleImports = {
    get: function (obj: WebAssembly.Imports, symName: string) {
        if (!GOT[symName]) {
            GOT[symName] = new WebAssembly.Global({ 'value': 'i32', 'mutable': true });
        }
        return GOT[symName]
    }
};

const info: WebAssembly.Imports = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg,
    'GOT.mem': new Proxy(asmLibraryArg, GOTHandler),
    'GOT.func': new Proxy(asmLibraryArg, GOTHandler),
};

export { asmLibraryArg, info, GOT, GOTHandler, ENVIRONMENT_IS_NODE, ENVIRONMENT_IS_PTHREAD }