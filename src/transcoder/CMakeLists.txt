SET(CORE_CODER_SRC
${CMAKE_SOURCE_DIR}/src/transcoder/core-transcoder.c
${CMAKE_SOURCE_DIR}/src/transcoder/parser-transcoder.cpp
)

add_executable(core-img ${CORE_CODER_SRC})
add_executable(core-audio ${CORE_CODER_SRC})
add_executable(core-video ${CORE_CODER_SRC})

SET(EXTERNAL_FN
  "['_saveSetjmp','_stdout','_stderr','_stdin','_hypot','_pthread_mutexattr_init','_log10f','_cosf','_cbrt','_exp2','_sinf','_atanf','_atan2f','_log2f','_snprintf','_atoi','_access','_strtod','_strspn','_strncat','_strerror_r','_ldexpf','_memchr','_gettimeofday','_tolower','_strrchr','_sscanf','_gf_fopen','_gf_feof','_gf_ftell','_gf_fread','_gf_fseek','_gf_fsize','_my_str_lwr','_strncasecmp','_strstr','_strcspn','_strcasecmp','_free','_emscripten_stack_get_end','_emscripten_stack_set_limits','_stdin','_gf_free','_gf_fwrite','_gf_malloc','_gf_realloc','_gf_fclose','_gf_fopen_ex','_gf_log','_gf_log_lt','_emscripten_longjmp','_gf_log_tool_level_on','___threwValue','___THREW__','_stdout','_logs_mx','_stderr','_pthread_mutex_unlock','_pthread_mutex_lock','_pthread_self','_sprintf','_vfprintf','_fprintf','_bsearch','_frexp','_exp2f','_llrint','_fwrite','_cos','_cosh','_acos','_sin','_sinh','_asin','_tan','_tanh','_atan','_exp','_log','_fabs','_strncmp','_strdup','_ldexp','_pthread_mutex_destroy','_pthread_mutex_init','_posix_memalign','_pow','_vsnprintf','_getenv','_strcmp','_strlen','_strcpy','_strcat','_strncpy','_strchr','_memset','_memcpy','_memmove','_memalign','_memcmp','_calloc','_realloc','_gf_url_concatenate','_gf_strdup','_gf_crc_32','_fflush','_siprintf','_gf_fflush','_evg_fill_run','_evg_grey_fill_const_a','_evg_grey_fill_const','_evg_grey_fill_var','_evg_grey_fill_single','_gf_pixel_fmt_parse','_gf_pixel_fmt_name','_gf_pixel_fmt_all_names','_gf_audio_fmt_parse','_gf_audio_fmt_name','_gf_audio_fmt_all_names','_gf_cicp_parse_color_primaries','_gf_cicp_color_primaries_name','_gf_cicp_color_primaries_all_names','_gf_cicp_parse_color_transfer','_gf_cicp_color_transfer_name','_gf_cicp_color_matrix_name','_gf_cicp_color_transfer_all_names','_gf_cicp_parse_color_matrix','_gf_cicp_color_primaries_all_names','_gf_cicp_color_matrix_all_names','_isatty','_fputs','_strtol','_tmpfile','_ftello','_fseeko','_fread','_fclose','_gf_sys_clock_high_res','_roundf','_round','___small_sprintf','_lrintf','_qsort','_abs','_srand','_rand','_testSetjmp','___multi3','_gmtime_r','_isalnum','_opendir','_mkdir','_atan2','_fiprintf','_fputc','_gf_sys_has_filter_global_args','_gf_parse_frac','_gf_filter_pid_check_caps','_gf_filter_pid_get_property','_gf_timestamp_rescale','_gf_parse_lfrac','_gf_sys_has_filter_global_meta_args','_gf_error_to_string','_memrchr','_gf_file_exists','_gf_fileio_read_mode','_gf_fileio_get_stats','_gf_fileio_check','_gf_fileio_from_url','_gf_fileio_open_url','_gf_fileio_write_mode','_gf_fileio_translate_url','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats_u32','_gf_fileio_get_udta']"
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