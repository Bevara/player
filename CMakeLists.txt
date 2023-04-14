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

include_directories(include
                    third_parties/gpac/include 
                    third_parties/rapidjson/include 
                    ${CMAKE_BINARY_DIR}/third_parties/gpac
)


link_directories(${CMAKE_BINARY_DIR}/third_parties/gpac/bin/gcc)

add_subdirectory(filters)
add_subdirectory(src)

list(APPEND WASM_FILES ${CMAKE_BINARY_DIR}/core.wasm ${CMAKE_BINARY_DIR}/player.wasm)

add_custom_target (serve
  COMMAND npm run serve
)

add_custom_target (release
  COMMAND npm run build:prod && ${CMAKE_COMMAND} -E copy *.wasm ${CMAKE_CURRENT_BINARY_DIR}/dist/ && ${CMAKE_COMMAND} -E copy *.js ${CMAKE_CURRENT_BINARY_DIR}/dist/ && ${CMAKE_COMMAND} -E copy ${CMAKE_SOURCE_DIR}/filters/*.json ${CMAKE_CURRENT_BINARY_DIR}/dist/
)

add_custom_target (test
  COMMAND npm run test
)

add_custom_target (test-watch
  COMMAND npm run test-watch
)

#add_dependencies(test release core player)
