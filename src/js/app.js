"use strict";

class App {
    constructor(albums) {
        this.locale = 'de';
        this.gallery = null;
        this.albums = albums;
        this.album = null;

        if (!this.detectTouch()) {
            document.querySelector('body').classList.add('notouch');
        }

        this.initAlbums();
        this.initLocale();
        this.initRoute();
    }

    detectTouch() {
        return 'ontouchstart' in document.documentElement;
    }

    initAlbums() {
        this.album = new Album(this.albums, (hash) => {

            window.history.pushState({}, "", '#' + hash);
            this.doRoute(hash);
        });
    }

    initLocale() {
        window.addEventListener('updatelocale', (e) => {

            const locale = e.detail.value;
            this.locale = locale;

            document.querySelectorAll('.locale .language').forEach(el => {
                el.classList.toggle('-active');
            });

            Translator.setLocale(locale);
            Translator.translateAll();
        });

        document.querySelectorAll('.locale .language').forEach(el => {
            el.addEventListener('click', function() {

                const locale = this.getAttribute('data-value');
                let event = new CustomEvent(
                    "updatelocale",
                    {
                        detail: {
                            value: locale,
                        }
                    }
                );
                window.dispatchEvent(event);
            });
        });

        Translator.setLocale(this.locale);
        Translator.translateAll();
    }

    initRoute() {
        window.addEventListener('hashchange', (e) => {
            const hash = e.newURL.replace(/^(.*)#/, '').replace(/[^a-z0-9\-/]/, '');
            this.doRoute(hash);
        });

        const hash = window.location.hash.replace(/^(.*)#/, '').replace(/[^a-z0-9\-/]/, '');
        this.doRoute(hash);
    }

    doRoute(hash) {
        if (typeof hash !== 'string') {
            hash = '';
        }
        const parts = hash.split('/');

        if (typeof parts[0] !== 'string') {
            return;
        }

        switch (parts[0]) {
            case 'gallery':
                // gallery/[albumid]/[imageid]
                const albumId = (typeof parts[1] === 'string') ? parts[1] : null;
                const imageId = (typeof parts[2] === 'string') ? parts[2] : null;

                if (albumId) {
                    this.actionGallery(albumId, imageId);
                }
                break;
            default:
                this.actionIndex();
                break;
        }
    }

    actionIndex() {
        if (this.gallery && this.gallery.state) {
            this.gallery.hide();
        }
    }

    actionGallery(albumId, imageId) {
        let album = null;
        this.albums.forEach(alb => {
            if (alb.hash === albumId) {
                album = alb;
            }
        });

        if (album) {
            this.album.setAlbum(albumId);

            if (!this.gallery) {
                this.gallery = new Gallery((albumId, imageId) => {
                    var hash = 'gallery/' + albumId + '/' + imageId;
                    window.history.pushState({}, "", '#' + hash);
                    this.doRoute(hash);
                });
            }

            this.gallery.show(album, imageId);
        }
    }
}
