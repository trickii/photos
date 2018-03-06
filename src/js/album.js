"use strict";

class Album {
    constructor(albums, onSelect) {
        this.state = false;
        this.albums = albums;
        this.cnt = null;
        this.canvas = null;
        this.onSelect = onSelect;
        this.curr = 0;

        this.init();
    }

    init() {
        this.createElements();

        if ('ontouchstart' in document.documentElement) {
            let xDown = null;
            let yDown = null;

            const handleTouchStart = (evt) => {
                xDown = evt.touches[0].clientX;
                yDown = evt.touches[0].clientY;
            };

            const handleTouchMove = (evt) => {
                if (!xDown || !yDown) {
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

                    } else {

                    }
                }

                xDown = null;
                yDown = null;
            };

            this.cnt.addEventListener('touchstart', handleTouchStart, false);
            this.cnt.addEventListener('touchmove', handleTouchMove, false);
        } else {
            window.addEventListener('keypress', (e) => {
                switch (e.keyCode) {
                    case 37:
                        this.gotoPrev();
                        break;
                    case 39:
                        this.gotoNext();
                        break;
                }
            });
        }

        window.addEventListener('resize', () => {
            if (this.isLandscape()) {
                this.setAlbum(this.albums[0].hash, true);
            }
        });
    }

    isLandscape() {
        return window.matchMedia("(orientation: landscape)").matches;
    }

    isPortrait() {
        return window.matchMedia("(orientation: portrait)").matches;
    }

    isAvailable() {
        return this.isPortrait() && !this.isGalleryShowed();
    }

    isGalleryShowed() {
        return document.querySelectorAll('.gallery.-show').length === 1;
    }

    gotoPrev() {
        if (!this.isAvailable()) {
            return;
        }

        this.curr--;
        if (this.curr < 0) {
            this.curr = 0;
        }

        let prev = null;
        this.albums.forEach((album, i) => {
            if (this.curr === i) {
                prev = album.hash;
            }
        });

        this.setAlbum(prev);
    }

    gotoNext() {
        if (!this.isAvailable()) {
            return;
        }

        this.curr++;
        if (this.curr > this.albums.length - 1) {
            this.curr = this.albums.length - 1;
        }

        let next = null;
        this.albums.forEach((album, i) => {
            if (this.curr === i) {
                next = album.hash;
            }
        });

        this.setAlbum(next);
    }

    createElements() {
        const self = this;
        this.cnt = document.querySelector('.albums');
        this.canvas = document.createElement('div');
        this.canvas.classList.add('canvas');

        const points = document.createElement('div');
        points.classList.add('points');

        this.albums.forEach((album, i) => {

            const el = document.createElement('div');
            el.classList.add('album');

            const box = document.createElement('div');
            box.classList.add('box');
            box.setAttribute('data-hash', album.hash);
            box.addEventListener('click', function() {
                const hash = 'gallery/' + this.getAttribute('data-hash');
                self.onSelect(hash);
            });

            const cover = document.createElement('img');
            cover.classList.add('cover');
            cover.alt = '';
            cover.src = album.cover;

            const infobox = document.createElement('div');
            infobox.classList.add('info');

            const title = document.createElement('h3');
            title.classList.add('title');
            title.setAttribute('data-t', album.title);
            title.innerHTML = Translator.translate(album.title);

            const description = document.createElement('p');
            description.classList.add('description');
            description.setAttribute('data-t', album.description);
            description.innerHTML = Translator.translate(album.description);

            box.appendChild(cover);
            infobox.appendChild(title);
            infobox.appendChild(description);
            el.appendChild(box);
            el.appendChild(infobox);
            this.canvas.appendChild(el);

            const point = document.createElement('div');
            point.classList.add('point');
            point.setAttribute('data-hash', album.hash);
            if (i === 0) {
                point.classList.add('-active');
            }
            points.appendChild(point);
        });

        this.cnt.appendChild(this.canvas);
        this.cnt.appendChild(points);
    }

    setAlbum(albumId, force) {
        if (!this.isAvailable() && force !== true) {
            return;
        }

        // const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        const oldActive = document.querySelector('.albums .points .point.-active');
        const newActive = document.querySelector('.albums .points .point[data-hash="' + albumId + '"]');

        if (oldActive) {
            oldActive.classList.remove('-active');
        }
        newActive.classList.add('-active');

        this.albums.forEach((album, i) => {
            if (albumId === album.hash) {
                this.curr = i;
            }
        });

        this.canvas.style.transform = 'translateX(' + (this.curr * -100) + 'vw)';
    }
}
