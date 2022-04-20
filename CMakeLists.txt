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
set(USE_OPT "-O2")

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
${CMAKE_SOURCE_DIR}/src/common/core-player.c
${CMAKE_SOURCE_DIR}/src/common/common.cpp
)

add_executable(core-player ${CORE_PLAYER_SRC})

set_target_properties( core-player 
                        PROPERTIES 
                            LINK_FLAGS "${USE_FLAGS} -s USE_LIBJPEG=1 -s TOTAL_MEMORY=128MB -s USE_LIBPNG=1 --no-entry -s MAIN_MODULE=2  -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS=['stringToUTF8','UTF8ToString'] -s EXPORTED_FUNCTIONS=['_stdin','_gf_free','_gf_malloc','_gf_filter_pck_merge_properties','_gf_filter_pck_discard','_gf_filter_pck_truncate','_gf_filter_pid_set_eos','_gf_log','_gf_log_lt','_emscripten_longjmp','_gf_log_tool_level_on','_gf_filter_pid_drop_packet','_gf_filter_pck_get_frame_interface','_gf_filter_pid_is_eos','___threwValue','___THREW__','_stdout','_logs_mx','_stderr','_pthread_mutex_unlock','_pthread_mutex_lock','_pthread_self','_sprintf','_vfprintf','_fprintf','_bsearch','_frexp','_llrint','_fwrite','_cos','_cosh','_acos','_sin','_sinh','_asin','_tan','_tanh','_atan','_exp','_log','_fabs','_strncmp','_strdup','_gf_filter_pck_get_timescale','_gf_filter_pck_get_cts','_gf_filter_pck_get_duration','_gf_fileio_url','_gf_fileio_new','_gf_fileio_set_stats_u32','_ldexp','_pthread_mutex_destroy','_pthread_mutex_init','_posix_memalign','_pow','_vsnprintf','_getenv','_strcmp','_strlen','_strcpy','_strcat','_strncpy','_strchr','_memset','_memcpy','_memmove','_memalign','_memcmp','_calloc','_realloc','_gf_url_concatenate','_gf_strdup','_gf_fileio_get_udta','_gf_bs_new','_gf_bs_available','_gf_bs_read_int','_gf_bs_get_position','_gf_bs_del','_gf_filter_get_udta','_gf_filter_pid_get_packet','_gf_filter_pck_get_data','_gf_filter_pid_set_property','_gf_filter_pck_new_alloc','_gf_filter_pck_send','_gf_filter_pid_check_caps','_gf_filter_pid_get_property','_gf_filter_pid_new','_gf_filter_pid_copy_properties','_gf_filter_pid_set_property','_gf_filter_set_name','_gf_filter_pck_set_dependency_flags','_gf_filter_pid_set_framing_mode','_gf_filter_pck_new_ref','_gf_filter_pck_set_cts','_gf_filter_pck_set_sap','_gf_filter_pck_set_duration','_gf_filter_pck_get_property','_gf_filter_pck_set_byte_offset','_gf_filter_pck_set_framing','_gf_filter_pck_set_seek_flag','_gf_filter_pck_get_seek_flag','_fflush','_siprintf'] -s ERROR_ON_UNDEFINED_SYMBOLS=0"
                            )

target_link_libraries(core-player 
  libgpac_static.a
)
list(APPEND WASM_FILES ${CMAKE_BINARY_DIR}/core-player.wasm)


add_custom_target (serve
  COMMAND npm run serve
)

add_custom_target (release
  COMMAND npm run build:prod && ${CMAKE_COMMAND} -E copy ${WASM_FILES} ${CMAKE_CURRENT_BINARY_DIR}/dist/
)

add_custom_target (test
  COMMAND npm run test
)

add_dependencies(test release core-player)