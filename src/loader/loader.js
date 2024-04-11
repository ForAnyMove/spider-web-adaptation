
async function preload(middleLoader, callback) {

    //     const body = document.getElementsByTagName('body')[0];
    //     body.insertAdjacentHTML('afterbegin', `<div class="mask">
    //     <div class="banter-loader">
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //       <div class="banter-loader__box"></div>
    //     </div>
    //   </div>`)

    let isLoaded = false;

    window.addEventListener('load', () => {
        isLoaded = true;
    });

    await middleLoader?.();

    let mask = document.querySelector('.mask');

    if (isLoaded) {
        mask.classList.add('hide');
        setTimeout(() => {
            mask.remove();
        }, 600);
    } else {
        window.addEventListener('load', () => {
            mask.classList.add('hide');
            setTimeout(() => {
                mask.remove();
            }, 600);
        });
    }

}

export { preload }