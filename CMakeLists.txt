cmake_minimum_required(VERSION 3.7)
project(Player)

set(CMAKE_CXX_STANDARD 20)
set (CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
option(DEBUG_MODE "Compile in player in debug mode" OFF)

add_definitions(-fpic)

configure_file(templates/template.webpack.config.js ${CMAKE_SOURCE_DIR}/webpack.config.js)
configure_file(templates/template.karma.conf.js ${CMAKE_SOURCE_DIR}/karma.conf.js)
configure_file(webinterface/Bevara.ico ${CMAKE_BINARY_DIR}/favicon.ico)

set(USE_DEBUG "-g")
set(USE_OPT "-O3")

if(DEBUG_MODE)
  set(USE_FLAGS "${USE_DEBUG}")
else()
  set(USE_FLAGS "${USE_OPT}")
endif()

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${USE_FLAGS}")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${USE_FLAGS}")

SET(PLAYER_CORE
${CMAKE_SOURCE_DIR}/src/player.c
${CMAKE_SOURCE_DIR}/src/parse_info.cpp
${CMAKE_SOURCE_DIR}/src/fetch_memio.c
)

include_directories(include
                    third_parties/gpac/include 
                    third_parties/rapidjson/include 
                    ${CMAKE_BINARY_DIR}/third_parties/gpac
)


link_directories(${CMAKE_BINARY_DIR}/third_parties/gpac/bin/gcc)

# add_executable(player ${PLAYER_CORE})
# set_target_properties( player 
#                         PROPERTIES 
#                             LINK_FLAGS "-s MAIN_MODULE=1 -s USE_SDL=2 -s FETCH=1 -s USE_ZLIB=1 -s USE_PTHREADS=1 -s ENVIRONMENT=web,worker"
#                             )

# target_link_libraries(player
# #${CMAKE_BINARY_DIR}/third_parties/gpac/src/utils/list.o
# #${CMAKE_BINARY_DIR}/third_parties/gpac/src/utils/alloc.o
# libgpac_static.a
# )

#set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

add_subdirectory(filters)

SET(CORE_PLAYER_SRC
${CMAKE_SOURCE_DIR}/src/player/core-player.c
${CMAKE_SOURCE_DIR}/src/player/parser-player.cpp
)

SET(CORE_CODER_SRC
${CMAKE_SOURCE_DIR}/src/transcoder/core-transcoder.c
${CMAKE_SOURCE_DIR}/src/transcoder/parser-transcoder.cpp
)

add_executable(core-img ${CORE_CODER_SRC})
add_executable(core-audio ${CORE_CODER_SRC})
add_executable(core-video ${CORE_CODER_SRC})
add_executable(core-canvas ${CORE_PLAYER_SRC})

set_target_properties( core-img 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s USE_ZLIB=1 -s TOTAL_MEMORY=128MB --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=['_saveSetjmp','_stdout','_stderr','_stdin','_hypot','_pthread_mutexattr_init','_log10f','_cosf','_cbrt','_exp2','_sinf','_atanf','_atan2f','_snprintf','_atoi','_access','_strtod','_strspn','_strncat','_strerror_r','_ldexpf','_gf_m4a_write_config_bs','_gf_fgetc','_gf_bs_get_content','_gf_bs_align','_gf_m4a_get_profile','_memchr','_gettimeofday','_tolower','_strrchr','_sscanf','_gf_bs_seek','_gf_bs_from_file','_gf_bs_write_data','_gf_bs_reassign_buffer','_gf_fopen','_gf_log_get_tool_level','_gf_4cc_to_str','_gf_filter_pck_get_interlaced','_gf_filter_pid_set_udta','_gf_filter_pid_set_property_dyn','_gf_bs_skip_bytes','_gf_bs_write_data','_gf_bs_write_u16_le','_gf_filter_pck_set_roll_info','_gf_filter_pid_set_property_str','_gf_bs_write_u32_le','_gf_itags_get_name','_gf_filter_pck_set_corrupted','_gf_filter_pck_set_dts','_gf_itags_find_by_id3tag','_gf_bs_read_u16_le','_gf_bs_read_u32_le','_gf_bs_read_data','_gf_odf_ac3_cfg_write','_gf_feof','_gf_bs_read_u16','_gf_bs_read_u32','_gf_bs_read_u8','_gf_filter_pid_set_name','_gf_opts_get_int','_gf_ftell','_gf_filter_pck_get_byte_offset','_gf_filter_pid_get_property_str','_gf_sys_is_test_mode','_gf_filter_pid_would_block','_gf_filter_post_process_task','_gf_filter_pck_new_shared','_gf_filter_pid_set_info','_gf_fileio_get_stats','_gf_fileio_check','_gf_filter_pid_raw_new','_gf_fread','_gf_fseek','_gf_fsize','_gf_fileio_read_mode','_my_str_lwr','_strncasecmp','_strstr','_strcspn','_strcasecmp','_deflate','_deflateInit2_','_crc32','_deflateEnd','_free','_emscripten_stack_get_end','_emscripten_stack_set_limits','_stdin','_gf_free','_gf_fwrite','_gf_malloc','_gf_realloc','_gf_pixel_get_size_info','_gf_file_ext_start','_gf_filter_reporting_enabled','_gf_file_exists','_gf_fclose','_gf_fopen_ex','_gf_fileio_from_url','_gf_fileio_open_url','_gf_fileio_write_mode','_gf_fileio_translate_url','_gf_filter_pck_merge_properties','_gf_filter_pck_expand','_gf_filter_pck_discard','_gf_filter_pid_caps_query','_gf_filter_override_caps','_gf_filter_pck_truncate','_gf_filter_pid_send_event','_gf_filter_pid_set_eos','_gf_filter_pid_init_play_event','_gf_log','_gf_log_lt','_emscripten_longjmp','_gf_log_tool_level_on','_gf_filter_pid_drop_packet','_gf_filter_pck_get_frame_interface','_gf_filter_pid_is_eos','___threwValue','___THREW__','_stdout','_logs_mx','_stderr','_pthread_mutex_unlock','_pthread_mutex_lock','_pthread_self','_sprintf','_vfprintf','_fprintf','_bsearch','_frexp','_exp2f','_llrint','_fwrite','_cos','_cosh','_acos','_sin','_sinh','_asin','_tan','_tanh','_atan','_exp','_log','_fabs','_strncmp','_strdup','_gf_filter_pck_get_timescale','_gf_filter_pck_get_cts','_gf_filter_pck_get_duration','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats_u32','_ldexp','_pthread_mutex_destroy','_pthread_mutex_init','_posix_memalign','_pow','_vsnprintf','_getenv','_strcmp','_strlen','_strcpy','_strcat','_strncpy','_strchr','_memset','_memcpy','_memmove','_memalign','_memcmp','_calloc','_realloc','_gf_url_concatenate','_gf_strdup','_gf_fileio_get_udta','_gf_bs_new','_gf_bs_available','_gf_bs_read_int','_gf_bs_get_position','_gf_bs_del','_gf_filter_get_udta','_gf_filter_pid_get_packet','_gf_filter_pck_get_data','_gf_filter_pid_set_property','_gf_filter_pck_new_alloc','_gf_filter_pck_send','_gf_filter_pid_check_caps','_gf_filter_pid_get_property','_gf_filter_pid_new','_gf_filter_pid_copy_properties','_gf_filter_pid_set_property','_gf_filter_set_name','_gf_filter_pck_set_dependency_flags','_gf_filter_pid_set_framing_mode','_gf_filter_pck_new_ref','_gf_filter_pck_set_cts','_gf_filter_pck_set_sap','_gf_filter_pck_set_duration','_gf_filter_pck_get_property','_gf_filter_pck_set_byte_offset','_gf_filter_pck_set_framing','_gf_crc_32','_gf_bs_read_long_int','_gf_bs_read_u24','_gf_filter_pck_get_dependency_flags','_gf_filter_pck_get_framing','_gf_filter_pck_set_seek_flag','_gf_filter_pck_get_seek_flag','_fflush','_siprintf'] -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )

set_target_properties( core-audio 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s USE_ZLIB=1 -s TOTAL_MEMORY=128MB --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=['_saveSetjmp','_stdout','_stderr','_stdin','_hypot','_pthread_mutexattr_init','_log10f','_cosf','_cbrt','_exp2','_sinf','_atanf','_atan2f','_snprintf','_atoi','_access','_strtod','_strspn','_strncat','_strerror_r','_ldexpf','_gf_m4a_write_config_bs','_gf_fgetc','_gf_bs_get_content','_gf_bs_align','_gf_m4a_get_profile','_memchr','_gettimeofday','_tolower','_strrchr','_sscanf','_gf_bs_seek','_gf_bs_from_file','_gf_bs_write_data','_gf_bs_reassign_buffer','_gf_fopen','_gf_log_get_tool_level','_gf_4cc_to_str','_gf_filter_pck_get_interlaced','_gf_filter_pid_set_udta','_gf_filter_pid_set_property_dyn','_gf_bs_skip_bytes','_gf_bs_write_data','_gf_bs_write_u16_le','_gf_filter_pck_set_roll_info','_gf_filter_pid_set_property_str','_gf_bs_write_u32_le','_gf_itags_get_name','_gf_filter_pck_set_corrupted','_gf_filter_pck_set_dts','_gf_itags_find_by_id3tag','_gf_bs_read_u16_le','_gf_bs_read_u32_le','_gf_bs_read_data','_gf_odf_ac3_cfg_write','_gf_feof','_gf_bs_read_u16','_gf_bs_read_u32','_gf_bs_read_u8','_gf_filter_pid_set_name','_gf_opts_get_int','_gf_ftell','_gf_filter_pck_get_byte_offset','_gf_filter_pid_get_property_str','_gf_sys_is_test_mode','_gf_filter_pid_would_block','_gf_filter_post_process_task','_gf_filter_pck_new_shared','_gf_filter_pid_set_info','_gf_fileio_get_stats','_gf_fileio_check','_gf_filter_pid_raw_new','_gf_fread','_gf_fseek','_gf_fsize','_gf_fileio_read_mode','_my_str_lwr','_strncasecmp','_strstr','_strcspn','_strcasecmp','_deflate','_deflateInit2_','_crc32','_deflateEnd','_free','_emscripten_stack_get_end','_emscripten_stack_set_limits','_stdin','_gf_free','_gf_fwrite','_gf_malloc','_gf_realloc','_gf_pixel_get_size_info','_gf_file_ext_start','_gf_filter_reporting_enabled','_gf_file_exists','_gf_fclose','_gf_fopen_ex','_gf_fileio_from_url','_gf_fileio_open_url','_gf_fileio_write_mode','_gf_fileio_translate_url','_gf_filter_pck_merge_properties','_gf_filter_pck_expand','_gf_filter_pck_discard','_gf_filter_pid_caps_query','_gf_filter_override_caps','_gf_filter_pck_truncate','_gf_filter_pid_send_event','_gf_filter_pid_set_eos','_gf_filter_pid_init_play_event','_gf_log','_gf_log_lt','_emscripten_longjmp','_gf_log_tool_level_on','_gf_filter_pid_drop_packet','_gf_filter_pck_get_frame_interface','_gf_filter_pid_is_eos','___threwValue','___THREW__','_stdout','_logs_mx','_stderr','_pthread_mutex_unlock','_pthread_mutex_lock','_pthread_self','_sprintf','_vfprintf','_fprintf','_bsearch','_frexp','_exp2f','_llrint','_fwrite','_cos','_cosh','_acos','_sin','_sinh','_asin','_tan','_tanh','_atan','_exp','_log','_fabs','_strncmp','_strdup','_gf_filter_pck_get_timescale','_gf_filter_pck_get_cts','_gf_filter_pck_get_duration','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats_u32','_ldexp','_pthread_mutex_destroy','_pthread_mutex_init','_posix_memalign','_pow','_vsnprintf','_getenv','_strcmp','_strlen','_strcpy','_strcat','_strncpy','_strchr','_memset','_memcpy','_memmove','_memalign','_memcmp','_calloc','_realloc','_gf_url_concatenate','_gf_strdup','_gf_fileio_get_udta','_gf_bs_new','_gf_bs_available','_gf_bs_read_int','_gf_bs_get_position','_gf_bs_del','_gf_filter_get_udta','_gf_filter_pid_get_packet','_gf_filter_pck_get_data','_gf_filter_pid_set_property','_gf_filter_pck_new_alloc','_gf_filter_pck_send','_gf_filter_pid_check_caps','_gf_filter_pid_get_property','_gf_filter_pid_new','_gf_filter_pid_copy_properties','_gf_filter_pid_set_property','_gf_filter_set_name','_gf_filter_pck_set_dependency_flags','_gf_filter_pid_set_framing_mode','_gf_filter_pck_new_ref','_gf_filter_pck_set_cts','_gf_filter_pck_set_sap','_gf_filter_pck_set_duration','_gf_filter_pck_get_property','_gf_filter_pck_set_byte_offset','_gf_filter_pck_set_framing','_gf_crc_32','_gf_bs_read_long_int','_gf_bs_read_u24','_gf_filter_pck_get_dependency_flags','_gf_filter_pck_get_framing','_gf_filter_pck_set_seek_flag','_gf_filter_pck_get_seek_flag','_fflush','_siprintf'] -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )

set_target_properties( core-video 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s USE_ZLIB=1 -s TOTAL_MEMORY=128MB --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=['_saveSetjmp','_stdout','_stderr','_stdin','_hypot','_pthread_mutexattr_init','_log10f','_cosf','_cbrt','_exp2','_sinf','_atanf','_atan2f','_snprintf','_atoi','_access','_strtod','_strspn','_strncat','_strerror_r','_ldexpf','_gf_m4a_write_config_bs','_gf_fgetc','_gf_bs_get_content','_gf_bs_align','_gf_m4a_get_profile','_memchr','_gettimeofday','_tolower','_strrchr','_sscanf','_gf_bs_seek','_gf_bs_from_file','_gf_bs_write_data','_gf_bs_reassign_buffer','_gf_fopen','_gf_log_get_tool_level','_gf_4cc_to_str','_gf_filter_pck_get_interlaced','_gf_filter_pid_set_udta','_gf_filter_pid_set_property_dyn','_gf_bs_skip_bytes','_gf_bs_write_data','_gf_bs_write_u16_le','_gf_filter_pck_set_roll_info','_gf_filter_pid_set_property_str','_gf_bs_write_u32_le','_gf_itags_get_name','_gf_filter_pck_set_corrupted','_gf_filter_pck_set_dts','_gf_itags_find_by_id3tag','_gf_bs_read_u16_le','_gf_bs_read_u32_le','_gf_bs_read_data','_gf_odf_ac3_cfg_write','_gf_feof','_gf_bs_read_u16','_gf_bs_read_u32','_gf_bs_read_u8','_gf_filter_pid_set_name','_gf_opts_get_int','_gf_ftell','_gf_filter_pck_get_byte_offset','_gf_filter_pid_get_property_str','_gf_sys_is_test_mode','_gf_filter_pid_would_block','_gf_filter_post_process_task','_gf_filter_pck_new_shared','_gf_filter_pid_set_info','_gf_fileio_get_stats','_gf_fileio_check','_gf_filter_pid_raw_new','_gf_fread','_gf_fseek','_gf_fsize','_gf_fileio_read_mode','_my_str_lwr','_strncasecmp','_strstr','_strcspn','_strcasecmp','_deflate','_deflateInit2_','_crc32','_deflateEnd','_free','_emscripten_stack_get_end','_emscripten_stack_set_limits','_stdin','_gf_free','_gf_fwrite','_gf_malloc','_gf_realloc','_gf_pixel_get_size_info','_gf_file_ext_start','_gf_filter_reporting_enabled','_gf_file_exists','_gf_fclose','_gf_fopen_ex','_gf_fileio_from_url','_gf_fileio_open_url','_gf_fileio_write_mode','_gf_fileio_translate_url','_gf_filter_pck_merge_properties','_gf_filter_pck_expand','_gf_filter_pck_discard','_gf_filter_pid_caps_query','_gf_filter_override_caps','_gf_filter_pck_truncate','_gf_filter_pid_send_event','_gf_filter_pid_set_eos','_gf_filter_pid_init_play_event','_gf_log','_gf_log_lt','_emscripten_longjmp','_gf_log_tool_level_on','_gf_filter_pid_drop_packet','_gf_filter_pck_get_frame_interface','_gf_filter_pid_is_eos','___threwValue','___THREW__','_stdout','_logs_mx','_stderr','_pthread_mutex_unlock','_pthread_mutex_lock','_pthread_self','_sprintf','_vfprintf','_fprintf','_bsearch','_frexp','_exp2f','_llrint','_fwrite','_cos','_cosh','_acos','_sin','_sinh','_asin','_tan','_tanh','_atan','_exp','_log','_fabs','_strncmp','_strdup','_gf_filter_pck_get_timescale','_gf_filter_pck_get_cts','_gf_filter_pck_get_duration','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats_u32','_ldexp','_pthread_mutex_destroy','_pthread_mutex_init','_posix_memalign','_pow','_vsnprintf','_getenv','_strcmp','_strlen','_strcpy','_strcat','_strncpy','_strchr','_memset','_memcpy','_memmove','_memalign','_memcmp','_calloc','_realloc','_gf_url_concatenate','_gf_strdup','_gf_fileio_get_udta','_gf_bs_new','_gf_bs_available','_gf_bs_read_int','_gf_bs_get_position','_gf_bs_del','_gf_filter_get_udta','_gf_filter_pid_get_packet','_gf_filter_pck_get_data','_gf_filter_pid_set_property','_gf_filter_pck_new_alloc','_gf_filter_pck_send','_gf_filter_pid_check_caps','_gf_filter_pid_get_property','_gf_filter_pid_new','_gf_filter_pid_copy_properties','_gf_filter_pid_set_property','_gf_filter_set_name','_gf_filter_pck_set_dependency_flags','_gf_filter_pid_set_framing_mode','_gf_filter_pck_new_ref','_gf_filter_pck_set_cts','_gf_filter_pck_set_sap','_gf_filter_pck_set_duration','_gf_filter_pck_get_property','_gf_filter_pck_set_byte_offset','_gf_filter_pck_set_framing','_gf_crc_32','_gf_bs_read_long_int','_gf_bs_read_u24','_gf_filter_pck_get_dependency_flags','_gf_filter_pck_get_framing','_gf_filter_pck_set_seek_flag','_gf_filter_pck_get_seek_flag','_fflush','_siprintf'] -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )

set_target_properties( core-canvas 
                            PROPERTIES 
                                LINK_FLAGS "${USE_FLAGS} -s USE_ZLIB=1 -s TOTAL_MEMORY=128MB --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=['_gf_pixel_fmt_all_names','_gf_audio_fmt_all_names','_saveSetjmp','_stdout','_stderr','_stdin','_hypot','_pthread_mutexattr_init','_log10f','_cosf','_cbrt','_exp2','_sinf','_atanf','_atan2f','_snprintf','_atoi','_access','_strtod','_strspn','_strncat','_strerror_r','_ldexpf','_gf_m4a_write_config_bs','_gf_fgetc','_gf_bs_get_content','_gf_bs_align','_gf_m4a_get_profile','_memchr','_gettimeofday','_tolower','_strrchr','_sscanf','_gf_bs_seek','_gf_bs_from_file','_gf_bs_write_data','_gf_bs_reassign_buffer','_gf_fopen','_gf_log_get_tool_level','_gf_4cc_to_str','_gf_filter_pck_get_interlaced','_gf_filter_pid_set_udta','_gf_filter_pid_set_property_dyn','_gf_bs_skip_bytes','_gf_bs_write_data','_gf_bs_write_u16_le','_gf_filter_pck_set_roll_info','_gf_filter_pid_set_property_str','_gf_bs_write_u32_le','_gf_itags_get_name','_gf_filter_pck_set_corrupted','_gf_filter_pck_set_dts','_gf_itags_find_by_id3tag','_gf_bs_read_u16_le','_gf_bs_read_u32_le','_gf_bs_read_data','_gf_odf_ac3_cfg_write','_gf_feof','_gf_bs_read_u16','_gf_bs_read_u32','_gf_bs_read_u8','_gf_filter_pid_set_name','_gf_opts_get_int','_gf_ftell','_gf_filter_pck_get_byte_offset','_gf_filter_pid_get_property_str','_gf_sys_is_test_mode','_gf_filter_pid_would_block','_gf_filter_post_process_task','_gf_filter_pck_new_shared','_gf_filter_pid_set_info','_gf_fileio_get_stats','_gf_fileio_check','_gf_filter_pid_raw_new','_gf_fread','_gf_fseek','_gf_fsize','_gf_fileio_read_mode','_my_str_lwr','_strncasecmp','_strstr','_strcspn','_strcasecmp','_deflate','_deflateInit2_','_crc32','_deflateEnd','_free','_emscripten_stack_get_end','_emscripten_stack_set_limits','_stdin','_gf_free','_gf_fwrite','_gf_malloc','_gf_realloc','_gf_pixel_get_size_info','_gf_file_ext_start','_gf_filter_reporting_enabled','_gf_file_exists','_gf_fclose','_gf_fopen_ex','_gf_fileio_from_url','_gf_fileio_open_url','_gf_fileio_write_mode','_gf_fileio_translate_url','_gf_filter_pck_merge_properties','_gf_filter_pck_expand','_gf_filter_pck_discard','_gf_filter_pid_caps_query','_gf_filter_override_caps','_gf_filter_pck_truncate','_gf_filter_pid_send_event','_gf_filter_pid_set_eos','_gf_filter_pid_init_play_event','_gf_log','_gf_log_lt','_emscripten_longjmp','_gf_log_tool_level_on','_gf_filter_pid_drop_packet','_gf_filter_pck_get_frame_interface','_gf_filter_pid_is_eos','___threwValue','___THREW__','_stdout','_logs_mx','_stderr','_pthread_mutex_unlock','_pthread_mutex_lock','_pthread_self','_sprintf','_vfprintf','_fprintf','_bsearch','_frexp','_exp2f','_llrint','_fwrite','_cos','_cosh','_acos','_sin','_sinh','_asin','_tan','_tanh','_atan','_exp','_log','_fabs','_strncmp','_strdup','_gf_filter_pck_get_timescale','_gf_filter_pck_get_cts','_gf_filter_pck_get_duration','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats_u32','_ldexp','_pthread_mutex_destroy','_pthread_mutex_init','_posix_memalign','_pow','_vsnprintf','_getenv','_strcmp','_strlen','_strcpy','_strcat','_strncpy','_strchr','_memset','_memcpy','_memmove','_memalign','_memcmp','_calloc','_realloc','_gf_url_concatenate','_gf_strdup','_gf_fileio_get_udta','_gf_bs_new','_gf_bs_available','_gf_bs_read_int','_gf_bs_get_position','_gf_bs_del','_gf_filter_get_udta','_gf_filter_pid_get_packet','_gf_filter_pck_get_data','_gf_filter_pid_set_property','_gf_filter_pck_new_alloc','_gf_filter_pck_send','_gf_filter_pid_check_caps','_gf_filter_pid_get_property','_gf_filter_pid_new','_gf_filter_pid_copy_properties','_gf_filter_pid_set_property','_gf_filter_set_name','_gf_filter_pck_set_dependency_flags','_gf_filter_pid_set_framing_mode','_gf_filter_pck_new_ref','_gf_filter_pck_set_cts','_gf_filter_pck_set_sap','_gf_filter_pck_set_duration','_gf_filter_pck_get_property','_gf_filter_pck_set_byte_offset','_gf_filter_pck_set_framing','_gf_crc_32','_gf_bs_read_long_int','_gf_bs_read_u24','_gf_filter_pck_get_dependency_flags','_gf_filter_pck_get_framing','_gf_filter_pck_set_seek_flag','_gf_filter_pck_get_seek_flag','_fflush','_siprintf'] -s ERROR_ON_UNDEFINED_SYMBOLS=0"
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
target_link_libraries(core-canvas 
  libgpac_static.a
)

list(APPEND WASM_FILES ${CMAKE_BINARY_DIR}/core-img.wasm ${CMAKE_BINARY_DIR}/core-audio.wasm ${CMAKE_BINARY_DIR}/core-video.wasm ${CMAKE_BINARY_DIR}/core-canvas.wasm)

add_custom_target (serve
  COMMAND npm run serve
)

add_custom_target (release
  COMMAND npm run build:prod && ${CMAKE_COMMAND} -E copy *.wasm ${CMAKE_CURRENT_BINARY_DIR}/dist/
)

add_custom_target (test
  COMMAND npm run test
)

add_custom_target (test-watch
  COMMAND npm run test-watch
)

add_dependencies(test release core-img core-audio core-video core-canvas)
