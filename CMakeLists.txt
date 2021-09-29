cmake_minimum_required(VERSION 3.7)
project(Player)

set(CMAKE_CXX_STANDARD 20)
set (CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
option(DEBUG_MODE "Compile in player in debug mode" ON)

add_definitions(-fpic)

configure_file(templates/template.webpack.config.js ${CMAKE_SOURCE_DIR}/webpack.config.js)
configure_file(webinterface/Bevara.ico ${CMAKE_BINARY_DIR}/favicon.ico)

SET(PLAYER_CORE
${CMAKE_SOURCE_DIR}/src/player.c
)

include_directories(include third_parties/gpac/include ${CMAKE_BINARY_DIR}/third_parties/gpac)
link_directories(${CMAKE_BINARY_DIR}/third_parties/gpac/bin/gcc)

add_executable(player ${PLAYER_CORE})
set_target_properties( player 
                        PROPERTIES 
                            LINK_FLAGS "-s MAIN_MODULE=1"
                            )

target_link_libraries(player
#libgpac_static.a
)


add_custom_target (serve
  COMMAND npm run serve
)