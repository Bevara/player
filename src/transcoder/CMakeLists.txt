SET(CORE_CODER_SRC
${CMAKE_SOURCE_DIR}/src/transcoder/core-transcoder.c
${CMAKE_SOURCE_DIR}/src/transcoder/parser-transcoder.cpp
)

add_executable(core-img ${CORE_CODER_SRC})
add_executable(core-audio ${CORE_CODER_SRC})
add_executable(core-video ${CORE_CODER_SRC})

SET(EXTERNAL_FN
  "['_memchr','_gettimeofday','_tolower','_strrchr','_sscanf','_my_str_lwr','_strncasecmp','_strstr','_strcspn','_strcasecmp','_free','_emscripten_stack_get_end','_emscripten_stack_set_limits','_stdin','_gf_log','_gf_log_lt','_emscripten_longjmp','_gf_log_tool_level_on','___threwValue','___THREW__','_stdout','_logs_mx','_stderr','_pthread_mutex_unlock','_pthread_mutex_lock','_pthread_self','_sprintf','_vfprintf','_fprintf','_bsearch','_frexp','_exp2f','_llrint','_fwrite','_cos','_cosh','_acos','_sin','_sinh','_asin','_tan','_tanh','_atan','_exp','_log','_fabs','_strncmp','_strdup','_ldexp','_pthread_mutex_destroy','_pthread_mutex_init','_posix_memalign','_pow','_vsnprintf','_getenv','_strcmp','_strlen','_strcpy','_strcat','_strncpy','_strchr','_memset','_memcpy','_memmove','_memalign','_memcmp','_calloc','_realloc','_fflush','_siprintf','_isatty','_fputs','_strtol','_tmpfile','_ftello','_fseeko','_fread','_fclose','_roundf','_round','___small_sprintf','_lrintf','_qsort','_testSetjmp','___multi3','_gmtime_r','_isalnum','_opendir','_mkdir','_fiprintf','_fputc','_memrchr','_atol','_saveSetjmp','___floatunsitf','___floatsitf','___trunctfdf2','___extenddftf2','___trunctfsf2','___multf3',___divtf3,'_gf_file_exists','_gf_fileio_read_mode','_gf_fileio_get_stats','_gf_fileio_check','_gf_fileio_from_url','_gf_fileio_open_url','_gf_fileio_write_mode','_gf_fileio_translate_url','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats_u32','_gf_fileio_get_udta','_gf_url_concatenate']"
)

set_target_properties( core-img 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s USE_ZLIB=1 -s TOTAL_MEMORY=128MB --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )

set_target_properties( core-audio 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s USE_ZLIB=1 -s TOTAL_MEMORY=128MB --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )

set_target_properties( core-video 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s USE_ZLIB=1 -s TOTAL_MEMORY=128MB --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=${EXTERNAL_FN} -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )
                            

target_link_libraries(core-img 
  libgpac_static.a
)

target_link_libraries(core-audio 
  libgpac_static.a
)
target_link_libraries(core-video 
  libgpac_static.a
)