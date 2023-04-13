find_program(UGLIFY_EXECUTABLE uglifyjs ${CMAKE_SOURCE_DIR}/node_modules/uglify-js/bin/)

set(THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set(JSMPEG_LOCATION ${THIRD_PARTIES}/jsmpeg)

set(JS_IN ${CMAKE_BINARY_DIR}/jsmpeg.js.in)
set(JS_JSMPEG ${CMAKE_BINARY_DIR}/jsmpeg.js)
set(JSMIN_JSMPEG ${CMAKE_BINARY_DIR}/jsmpeg.min.js)

set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

SET(COREJS_JSMPEG
	loader.js
	${JSMPEG_LOCATION}/src/video-element.js
	${JSMPEG_LOCATION}/src/player.js
	${JSMPEG_LOCATION}/src/buffer.js
	${JSMPEG_LOCATION}/src/ajax.js
	${JSMPEG_LOCATION}/src/fetch.js
	${JSMPEG_LOCATION}/src/ajax-progressive.js
	${JSMPEG_LOCATION}/src/websocket.js
	${JSMPEG_LOCATION}/src/ts.js
	${JSMPEG_LOCATION}/src/decoder.js
	${JSMPEG_LOCATION}/src/mpeg1.js
	${JSMPEG_LOCATION}/src/mpeg1-wasm.js
	${JSMPEG_LOCATION}/src/mp2.js
	${JSMPEG_LOCATION}/src/mp2-wasm.js
	${JSMPEG_LOCATION}/src/webgl.js
	${JSMPEG_LOCATION}/src/canvas2d.js
	${JSMPEG_LOCATION}/src/webaudio.js
	${JSMPEG_LOCATION}/src/wasm-module.js
)

#Concatenate js files
function(cat IN_FILE OUT_FILE)
  file(READ ${IN_FILE} CONTENTS)
  file(APPEND ${OUT_FILE} "${CONTENTS}")
endfunction()

file(WRITE ${JS_IN} "")

foreach(JSMPEG_FILE ${COREJS_JSMPEG})
  cat(${JSMPEG_FILE} ${JS_IN})
endforeach()

SET(CORE_JSMPEG
  ${JSMPEG_LOCATION}/src/wasm/mpeg1.c
  ${JSMPEG_LOCATION}/src/wasm/mp2.c
  ${JSMPEG_LOCATION}/src/wasm/buffer.c
)

SET(EXTERNAL_FN
"['setTempRet0','_mpeg1_decoder_create','_mpeg1_decoder_destroy','_mpeg1_decoder_get_write_ptr','_mpeg1_decoder_get_index','_mpeg1_decoder_set_index','_mpeg1_decoder_did_write','_mpeg1_decoder_has_sequence_header','_mpeg1_decoder_get_frame_rate','_mpeg1_decoder_get_coded_size','_mpeg1_decoder_get_width','_mpeg1_decoder_get_height','_mpeg1_decoder_get_y_ptr','_mpeg1_decoder_get_cr_ptr','_mpeg1_decoder_get_cb_ptr','_mpeg1_decoder_decode','_mp2_decoder_create','_mp2_decoder_destroy','_mp2_decoder_get_write_ptr','_mp2_decoder_get_index','_mp2_decoder_set_index','_mp2_decoder_did_write','_mp2_decoder_get_left_channel_ptr','_mp2_decoder_get_right_channel_ptr','_mp2_decoder_get_sample_rate','_mp2_decoder_decode']"
)

SET(CORE_CLEAN
	${CMAKE_BINARY_DIR}/jsmpeg.js
	${CMAKE_BINARY_DIR}/jsmpeg.js.in
)


add_executable(jsmpeg ${CORE_JSMPEG})

set_target_properties(jsmpeg
  PROPERTIES
  LINK_FLAGS "${USE_FLAGS} --no-entry  -s EXPORTED_FUNCTIONS=${EXTERNAL_FN}"
  ADDITIONAL_CLEAN_FILES "${CORE_CLEAN}"
)

configure_file(${JS_IN} ${JS_JSMPEG} COPYONLY)

if(UGLIFY_EXECUTABLE AND (NOT ${DEBUG_MODE}))
message(STATUS "JSmpeg files will be minified.")
add_custom_command(OUTPUT ${JSMIN_JSMPEG}
            COMMAND ${UGLIFY_EXECUTABLE}
            ARGS "${JS_JSMPEG} -o ${JSMIN_JSMPEG}"
   )
endif()