cmake_minimum_required(VERSION 3.7)
project(Player)

set(CMAKE_CXX_STANDARD 20)
set (CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
option(DEBUG_MODE "Compile in player in debug mode" ON)

add_definitions(-fpic)

configure_file(templates/template.webpack.config.js ${CMAKE_SOURCE_DIR}/webpack.config.js)
configure_file(webinterface/Bevara.ico ${CMAKE_BINARY_DIR}/favicon.ico)

set(USE_DEBUG "-g")
set(USE_FLAGS "${USE_DEBUG}")

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

SET(SIMPLE_IMG_CORE
${CMAKE_SOURCE_DIR}/src/simple-img/simple-img.c
)

add_executable(simple-img ${SIMPLE_IMG_CORE})

set_target_properties( simple-img 
                        PROPERTIES 
                            LINK_FLAGS "-g -s ERROR_ON_UNDEFINED_SYMBOLS=0 -s MAIN_MODULE=1 -s FETCH=1"
                            )

add_custom_target (serve
  COMMAND npm run serve
)