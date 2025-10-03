// Define component class
class VideoPlayer extends HTMLElement {

    connectedCallback() {
        const template = document.getElementById("video-player-template");
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.append(template.content.cloneNode(true));

        const container = this.shadowRoot.getElementById("video-container");
        const ui = this.shadowRoot.getElementById("ui");

        const playBtn = this.shadowRoot.getElementById("play-btn");
        const svgPlay = this.shadowRoot.getElementById("svg-play");
        const svgPause = this.shadowRoot.getElementById("svg-pause");
        
        const volumeBtn = this.shadowRoot.getElementById("volume-btn");
        const volumeRange = this.shadowRoot.getElementById("volume-range");
        const svgVolume = this.shadowRoot.getElementById("svg-volume");
        const svgMute = this.shadowRoot.getElementById("svg-mute");
        
        const fullscreenBtn = this.shadowRoot.getElementById("fullscreen-btn");
        const svgFullscreen = this.shadowRoot.getElementById("svg-fullscreen");
        const svgUnfullscreen = this.shadowRoot.getElementById("svg-unfullscreen");
        
        const video = this.shadowRoot.getElementById("video");
        const sources = video.getElementsByTagName('source');
        sources[0].src = this.getAttribute("src");
        const progressRange = this.shadowRoot.getElementById("progress-range");
        const totalTime = this.shadowRoot.getElementById("total-time");
        const currentTime = this.shadowRoot.getElementById("current-time");

        let timer = null;
        function clearTimer() {
            ui.style.display = "block";
            template.style.cursor = "";
            if (timer)
                clearTimeout(timer);
        }
        ui.addEventListener('mouseover', clearTimer);

        function setTimer() {
            clearTimer();
            timer = setTimeout(() => {
                ui.style.display = "none";
                template.style.cursor = "none";
            }, 3000);
        }
        video.addEventListener('mousemove', setTimer);
        ui.addEventListener('mouseleave', setTimer);

        function updateInputRange(element, value) {
            element.style.setProperty('--value', `${(value - element.min) / (element.max - element.min) * 100}%`);
        }

        function timeToHHMMSS(time) {
            let hours = Math.floor(time / 3600);
            time = time - hours * 3600;
            let minutes = Math.floor(time / 60);
            let seconds = Math.round(time - minutes * 60);

            if (minutes < 10) minutes = `0${minutes}`;
            if (seconds < 10) seconds = `0${seconds}`;

            if (hours === 0)
                return `${minutes}:${seconds}`;

            if (hours < 10) hours = `0${hours}`;
            return `${hours}:${minutes}:${seconds}`;
        }

        function setProgressSetVolume() {
            video.volume = volumeRange.value;
            updateInputRange(volumeRange, video.volume);
            progressRange.setAttribute("max", video.duration);
            updateInputRange(progressRange, 0);
            totalTime.innerHTML = timeToHHMMSS(video.duration);
            currentTime.innerHTML = timeToHHMMSS(0);

            setTimer();
        }
        video.addEventListener('loadedmetadata', setProgressSetVolume);

        function playPause() {
            if (video.paused || video.ended) {
                video.play();
                svgPlay.style.display = "none";
                svgPause.style.display = "block";
            } else {
                video.pause();
                svgPlay.style.display = "block";
                svgPause.style.display = "none";
            }
        }
        playBtn.addEventListener('click', playPause);
        video.addEventListener('click', playPause);

        let lastVolumeLevel = 1;
        function muteVideo() {
            if (video.volume > 0) {
                lastVolumeLevel = video.volume;
                video.volume = 0;
                volumeRange.value = 0;
                svgVolume.style.display = "none";
                svgMute.style.display = "block";
            } else {
                video.volume = lastVolumeLevel;
                volumeRange.value = lastVolumeLevel;
                svgVolume.style.display = "block";
                svgMute.style.display = "none";
            }

            updateInputRange(volumeRange, video.volume);
        }
        volumeBtn.addEventListener('click', muteVideo);

        function changeVolume() {
            video.volume = volumeRange.value;

            if (video.volume === 0) {
                svgVolume.style.display = "none";
                svgMute.style.display = "block";
            } else {
                svgVolume.style.display = "block";
                svgMute.style.display = "none";
            }

            updateInputRange(volumeRange, video.volume);
        }
        volumeRange.addEventListener('change', changeVolume);

        function resetProgress() {
            svgPlay.style.display = "block";
            svgPause.style.display = "none";
            progressRange.value = 0;
            currentTime.innerHTML = timeToHHMMSS(0);
            updateInputRange(progressRange, 0);
        }
        video.addEventListener('ended', resetProgress);

        function changeProgress() {
            video.currentTime = progressRange.value;
            updateInputRange(progressRange, progressRange.value);
        }
        progressRange.addEventListener('change', changeProgress);

        function updateTime() {
            progressRange.value = video.currentTime;
            currentTime.innerHTML = timeToHHMMSS(video.currentTime);
            updateInputRange(progressRange, video.currentTime);
        }
        video.addEventListener('timeupdate', updateTime);

        // Fullscreen events
        function toggleFullscreen() {
            if ( // If is in fullscreen
                (document.fullscreenElement && document.fullscreenElement !== null) ||
                (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
                (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
                (document.msFullscreenElement && document.msFullscreenElement !== null)
            ) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {     // Safari
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {      // Firefox
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {         // IE11
                    document.msExitFullscreen();
                }
                svgFullscreen.style.display = "block";
                svgUnfullscreen.style.display = "none";
            } else {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {    // Safari
                    container.webkitRequestFullscreen();
                } else if (container.mozRequestFullScreen) {       // Firefox
                    container.mozRequestFullScreen();
                } else if (container.msRequestFullscreen) {        // IE11
                    container.msRequestFullscreen();
                }
                svgFullscreen.style.display = "none";
                svgUnfullscreen.style.display = "block";
            }
        }
        fullscreenBtn.addEventListener('click', toggleFullscreen);

        function exitHandler() {
            if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                svgFullscreen.style.display = "block";
                svgUnfullscreen.style.display = "none";
            }
        }
        document.addEventListener('fullscreenchange', exitHandler);
        document.addEventListener('webkitfullscreenchange', exitHandler);
        document.addEventListener('mozfullscreenchange', exitHandler);
        document.addEventListener('MSFullscreenChange', exitHandler);
    }
}
// Create component
customElements.define("video-player", VideoPlayer);
