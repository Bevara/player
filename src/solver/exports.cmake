SET(GPAC
    '_gf_filter_get_dst_name'
    '_gf_filter_report_meta_option'
    '_gf_filter_path_escape_colon'
    '_vout_register'
    '_aout_register'
    '_fileout_register'
    '_filein_register'
    '_writegen_register'
    '_wcdec_register'
    '_wcenc_register'
    '_webgrab_register'
    '_resample_register'
    '_reframer_register'
    '_main'
)

SET(PTHREADS
    '_pthread_mutex_init'
    '_pthread_mutex_destroy'
    '_posix_memalign'
)

SET(ZLIB
    '_crc32'
    '_deflateInit2_'
    '_deflate'
    '_deflateEnd'
    '_inflate'
    '_inflateEnd'
    '_inflateInit2_'
)

SET(STDLIB
    '_vsnprintf'
    '_sprintf'
    '_siprintf'
    '_sscanf'
    '_snprintf'
    '___small_sprintf'
    '_stdout'
    '_stderr'
    '_memmove'
    '_calloc'
    '_realloc'
    '_memcmp'
    '_memchr'
    '_memcpy'
    '_free'
    '_memalign'
    '_getenv'
    '_strcasecmp'
    '_strcmp'
    '_strncasecmp'
    '_strncat'
    '_strncmp'
    '_strcspn'
    '_strspn'
    '_strcpy'
    '_strstr'
    '_strrchr'
    '_strchr'
    '_strlen'
    '_strtol'
    '_strdup'
    '_strcat'
    '_memset'
    '_exp2'
    '_atanf'
    '_sinf'
    '_bsearch'
    '_strtod'
    '_frexp'
    '_llrint'
    '_fabs'
    '_exp'
    '_exp2f'
    '_acos'
    '_asin'
    '_atan'
    '_sinh'
    '_tanh'
    '_tan'
    '_cosh'
    '_pow'
    '_qsort'
    '_log'
    '_log2f'
    '_cos'
    '_sin'
    '_ldexp'
    '_abs'
    '_srand'
    '_rand'
    '_round'
    '_roundf'
    '_open'
    '_fcntl'
    '_fstat'
    '_lseek'
    '_read'
    '_close'
    '_lrintf'
    '_fwrite'
    '_log10f'
    '_cbrt'
    '_strerror_r'
    '_iconv_open'
)

SET(EMSCRIPTEN
    '_emscripten_longjmp'
    '_saveSetjmp'
    '___threwValue'
    '___THREW__'
)


SET(EXTERNAL_FN
    ${GPAC}
    ${PTHREADS}
    ${ZLIB}
    ${STDLIB}
    ${EMSCRIPTEN}
)

 string(JOIN "," EXPORTED_FUNCTIONS ${EXTERNAL_FN})