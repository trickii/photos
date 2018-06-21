"use strict";

class Gallery {
    constructor(onSelect) {
        this.album = null;
        this.cnt = null;
        this.canvas = null;
        this.imageId = null;
        this.list = null;
        this.state = false;
        this.onSelect = onSelect;

        this.init();
    }

    init() {
        this.cnt = document.createElement('div');
        this.cnt.classList.add('gallery');
        document.querySelector('body').appendChild(this.cnt);

        if ('ontouchstart' in document.documentElement) {
            let xDown = null;
            let yDown = null;

            const handleTouchStart = (evt) => {
                if (evt.touches.length === 1) {
                    xDown = evt.touches[0].clientX;
                    yDown = evt.touches[0].clientY;
                }
            };

            const handleTouchMove = (evt) => {
                if (!xDown || !yDown || evt.touches.length > 1) {
                    return;
                }

                const xUp = evt.touches[0].clientX;
                const yUp = evt.touches[0].clientY;

                const xDiff = xDown - xUp;
                const yDiff = yDown - yUp;

                if (Math.abs(xDiff) > Math.abs(yDiff)) {
                    if (xDiff > 0) {
                        this.gotoNext();
                    } else {
                        this.gotoPrev();
                    }
                } else {
                    if (yDiff > 0) {
                        window.location.hash = '#';
                    } else {
                        /* down swipe */
                    }
                }

                xDown = null;
                yDown = null;
            };

            this.cnt.addEventListener('touchstart', handleTouchStart, false);
            this.cnt.addEventListener('touchmove', handleTouchMove, false);
        } else {
            window.addEventListener('keyup', (e) => {
                if (this.state) {
                    switch (e.keyCode) {
                        case 27:
                            window.location.hash = '#';
                            break;
                        case 37:
                            this.gotoPrev();
                            break;
                        case 39:
                            this.gotoNext();
                            break;
                    }
                }
            });
        }
    }

    initInterface() {

        const prevButton = document.createElement('div');
        prevButton.classList.add('button');
        prevButton.classList.add('prev');
        prevButton.addEventListener('click', () => {
            this.gotoPrev();
        });
        this.cnt.appendChild(prevButton);

        const nextButton = document.createElement('div');
        nextButton.classList.add('button');
        nextButton.classList.add('next');
        nextButton.addEventListener('click', () => {
            this.gotoNext();
        });
        this.cnt.appendChild(nextButton);

        const buttons = document.createElement('div');
        buttons.classList.add('buttons');

        const backButton = document.createElement('div');
        backButton.classList.add('button');
        backButton.classList.add('back');
        backButton.addEventListener('click', function() {
            window.location.hash = '#';
        });
        backButton.setAttribute('data-t', 'btn_back');
        backButton.innerHTML = Translator.translate('btn_back');
        buttons.appendChild(backButton);

        const listButton = document.createElement('div');
        listButton.classList.add('button');
        listButton.classList.add('list');
        listButton.addEventListener('click', () => {
            this.showList();
        });
        buttons.appendChild(listButton);

        const fullscreenButton = document.createElement('div');
        fullscreenButton.classList.add('button');
        fullscreenButton.classList.add('fullscreen');
        fullscreenButton.addEventListener('click', () => {
            this.toggleFullScreen();
        });
        buttons.appendChild(fullscreenButton);

        this.cnt.appendChild(buttons);
    }

    show(album, imageId) {
        this.cnt.classList.add('-show');
        if (this.state && this.album.hash === album.hash) {
            this.showImage(imageId);
        } else {
            this.showAlbum(album, imageId)
        }
        this.state = true;
    }

    hide() {
        this.canvas = null;
        this.album = null;
        this.imageId = null;
        this.list = null;

        this.cnt.classList.remove('-show');
        this.cnt.innerHTML = '';

        this.state = false;
    }

    showAlbum(album, imageId) {
        const self = this;
        this.album = album;

        this.initInterface();

        this.canvas = document.createElement('div');
        this.canvas.classList.add('canvas');

        this.list = document.createElement('div');
        this.list.classList.add('images');

        let imgId = this.album.images[0].hash;
        this.album.images.forEach((img) => {

            if (typeof imageId === 'string') {
                if (imageId === img.hash) {
                    imgId = imageId;
                }
            }

            const listImg = document.createElement('div');
            listImg.classList.add('image');
            listImg.classList.add(img.exif.orientation);
            listImg.setAttribute('data-hash', img.hash);
            listImg.addEventListener('click', function() {
                self.goto(this.getAttribute('data-hash'));
                self.hideList();
            });
            const listImgEl = document.createElement('img');
            listImgEl.alt = '';
            listImgEl.src = img.src;

            listImg.appendChild(listImgEl);
            this.list.appendChild(listImg);
        });

        const backButton = document.createElement('div');
        backButton.classList.add('button');
        backButton.classList.add('back');
        backButton.addEventListener('click', () => {
            this.hideList();
        });
        backButton.setAttribute('data-t', 'btn_back');
        backButton.innerHTML = Translator.translate('btn_back');
        this.list.appendChild(backButton);

        this.cnt.appendChild(this.canvas);
        this.cnt.appendChild(this.list);

        this.showImage(imgId);
    }

    showImage(imageId) {
        this.imageId = imageId;
        let imgData = null;
        let index = 0;

        this.album.images.forEach((img, i) => {
            if (imageId === img.hash) {
                imgData = img;
                index = i;
            }
        });

        const prevButton = document.querySelector('.gallery .prev');
        const nextButton = document.querySelector('.gallery .next');

        prevButton.classList.remove('-hide');
        nextButton.classList.remove('-hide');

        if (index === 0) {
            prevButton.classList.add('-hide');
        }
        if (index === this.album.images.length - 1) {
            nextButton.classList.add('-hide');
        }

        const img = document.createElement('div');
        img.classList.add('image');
        img.classList.add(imgData.exif.orientation);
        img.classList.add('-loading');

        const imgLoading = new Image;
        imgLoading.onload = function() {
            img.style.backgroundImage = 'url(' + this.src + ')';
            img.classList.add('-ready');
            setTimeout(() => {
                img.classList.add('-show');
            }, 16);
        };
        imgLoading.src = imgData.src;

        const imgInfo = document.createElement('div');
        imgInfo.classList.add('info');

        const infos = [];
        let details = null;
        if (imgData.exif.fnumber !== undefined) {
            infos.push('f/' + imgData.exif.fnumber);
        }
        if (imgData.exif.exposuretime !== undefined) {
            infos.push(imgData.exif.exposuretime);
        }
        if (imgData.exif.fnumber !== undefined) {
            infos.push('ISO ' + imgData.exif.isospeed);
        }
        if (infos.length > 0) {
            details = '<div class="details"><div>';
            details += infos.join('</div><div>');
            details += '</div></div>';
        }
        if (details) {
            imgInfo.innerHTML = details;
            img.appendChild(imgInfo);
        }

        this.canvas.appendChild(img);

        setTimeout(() => {
            if (document.querySelectorAll('.gallery .canvas .image').length > 1) {
                document.querySelector('.gallery .canvas .image:first-child').remove();
            }
        }, 1000);
    }

    gotoPrev() {
        const currId = this.imageId;
        let index = 0;
        this.album.images.forEach((img, i) => {
            if (currId === img.hash) {
                index = i - 1;
            }
        });

        if (index < 0) {
            index = 0;
        }

        this.goto(this.album.images[index].hash);
    }

    gotoNext() {
        const currId = this.imageId;
        let index = 0;
        this.album.images.forEach((img, i) => {
            if (currId === img.hash) {
                index = i + 1;
            }
        });

        if (index > this.album.images.length - 1) {
            index = this.album.images.length - 1;
        }

        this.goto(this.album.images[index].hash);
    }

    goto(imageId) {
        this.onSelect(this.album.hash, imageId);
    }

    showList() {
        this.list.classList.add('-show');
    }

    hideList() {
        this.list.classList.remove('-show');
    }

    toggleFullScreen() {
        const doc = window.document;
        const docEl = doc.documentElement;

        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        } else {
            cancelFullScreen.call(doc);
        }
    }
}
