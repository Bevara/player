cmake_minimum_required(VERSION 3.7)
project(Player)

set(CMAKE_CXX_STANDARD 20)
set (CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
option(DEBUG_MODE "Compile in player in debug mode" OFF)

add_definitions(-fpic)

configure_file(templates/template.webpack.config.js ${CMAKE_SOURCE_DIR}/webpack.config.js)
configure_file(templates/template.karma.conf.js ${CMAKE_SOURCE_DIR}/karma.conf.js)
configure_file(webinterface/Bevara.ico ${CMAKE_BINARY_DIR}/favicon.ico)

file(GLOB WASM_FILTERS
  "${CMAKE_BINARY_DIR}/filters/*.wasm"
)

file(COPY ${WASM_FILTERS} DESTINATION ${CMAKE_BINARY_DIR})

add_subdirectory(src)

add_custom_target (serve
  COMMAND npm run serve
)

add_custom_target (release
  COMMAND npm run build:prod && ${CMAKE_COMMAND} -E copy *.wasm ${CMAKE_CURRENT_BINARY_DIR}/dist/ && ${CMAKE_COMMAND} -E copy *.js ${CMAKE_CURRENT_BINARY_DIR}/dist/
)

add_custom_target (test
  COMMAND npm run test
)

add_custom_target (test-watch
  COMMAND npm run test-watch
)

add_dependencies(test release solver_1)