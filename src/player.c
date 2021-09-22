#if __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#define emscripten_sleep gf_sleep
#endif

#include <stdio.h>

typedef struct __Dec_Entry
{

} Dec_Entry;


Dec_Entry *EMSCRIPTEN_KEEPALIVE setup_acc(const char* args)
{
    return 0;
}

int main() {
    printf("coucou! \n");
    return 0;
}