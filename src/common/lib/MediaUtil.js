import _ from "lodash";
const LogPrefix = "[MediaUtil]";

export const MediaType = {
    Main: 'Main',
    Cam: 'Cam',
    Mic: 'Mic'
};

export const MediaQuality = {
    VeryHigh: 'VeryHigh',
    High: 'High',
    Medium: 'Medium',
    Low: 'Low',
    VeryLow: 'VeryLow',
};

const QualityInfo = {
    // [MediaQuality.VeryHigh]: {
    //     order: 10,
    //     width: 1920,
    //     height: 1080,
    //     frameRate: 30,
    //     bitrate: 6144 * 1000,
    //     simulcast: true,
    // },
    [MediaQuality.VeryHigh]: {
        order: 10,
        width: 1280,
        height: 720,
        frameRate: 30,
        bitrate: 1000 * 1000,
        simulcast: true,
    },
    [MediaQuality.High]: {
        order: 20,
        width: 1024,
        height: 576,
        frameRate: 30,
        bitrate: 1000 * 1000,
        //bitrate: 2048 * 1000,
        simulcast: false,
    },
    [MediaQuality.Medium]: {
        order: 30,
        width: 640,
        height: 360,
        frameRate: 30,
        bitrate: 512 * 1000,
        //bitrate: 1024 * 1000,
        simulcast: false,
    },
    [MediaQuality.Low]: {
        order: 40,
        width: 320,
        height: 180,
        frameRate: 25,
        bitrate: 256 * 1000,
        simulcast: false,
    },
    [MediaQuality.VeryLow]: {
        order: 50,
        width: 240,
        height: 135,
        frameRate: 25,
        bitrate: 128 * 1000,
        simulcast: false,
    },
    // [MediaQuality.VeryLow]: {
    //     order: 50,
    //     width: 160,
    //     height: 90,
    //     frameRate: 25,
    //     bitrate: 128 * 1000,
    //     simulcast: false,
    // },
}

export class MediaUtil {
    static getQualities(maxMediaQuality) {
        const maxQuality = QualityInfo[maxMediaQuality];
        const qualities = _.chain(QualityInfo)
            .values()
            .filter((q) => q.order >= maxQuality.order)
            .orderBy(['order'], ['asc'])
            .value();

        return qualities;
    }

    static getQualityInfo(quality) {
        return QualityInfo[quality];
    }

    static requestMediaPermission() {
        return new Promise(async (resolve, reject) => {
            let isAllowedMic = false;
            let isAllowedCam = false;

            console.log(LogPrefix, 'RequestMediaPermission... : audio and video');
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && navigator.mediaDevices.enumerateDevices) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
                    stream.getTracks().forEach(track => track.stop());

                    isAllowedMic = true;
                    isAllowedCam = true;
                    console.log(LogPrefix, 'RequestMediaPermission success : audio and video')
                } catch (error) {
                    console.log(LogPrefix, 'RequestMediaPermission... : audio only');
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
                        stream.getTracks().forEach(track => track.stop());

                        isAllowedMic = true;
                        console.log(LogPrefix, 'RequestMediaPermission success : audio only');
                    } catch (error) {
                        console.log(LogPrefix, 'RequestMediaPermission fail: audio only');
                    }

                    console.log(LogPrefix, 'RequestMediaPermission... : video only');
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});
                        stream.getTracks().forEach(track => track.stop());

                        isAllowedCam = true;
                        console.log(LogPrefix, 'Request media permission success : video only');
                    } catch (error) {
                        console.log(LogPrefix, 'Request media permission fail: video only');
                    }
                }

                resolve({mic: isAllowedMic, cam: isAllowedCam});
            } else {
                console.log(LogPrefix, 'RequestMediaPermission error : No getUserMedia or enumerateDevices');

                reject(new Error('RequestMediaPermission error : No getUserMedia or enumerateDevices'));
            }
        });
    }

    static enumerateDevices(mediaType) {
        return new Promise(async (resolve, reject) => {
            console.log(LogPrefix, 'EnumerateDevices');

            if(navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices();

                    if(mediaType === MediaType.Cam) {
                        resolve(_.filter(devices, (d) => d.kind === 'videoinput'));
                    } else if(mediaType === MediaType.Mic) {
                        resolve(_.filter(devices, (d) => d.kind === 'audioinput'));
                    } else {
                        resolve({
                            camDevices: _.filter(devices, (d) => d.kind === 'videoinput'),
                            micDevices: _.filter(devices, (d) => d.kind === 'audioinput'),
                        });
                    }
                } catch(error) {
                    console.log(LogPrefix, 'EnumerateDevices error : ', error);

                    reject(error);
                }
            } else {
                console.log(LogPrefix, 'No EnumerateDevices');

                reject(new Error('No EnumerateDevices'));
            }
        });
    }

    static getUsableDeviceId(micDeviceId, camDeviceId) {
        return new Promise(async (resolve, reject) => {
            if(navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const audioDevices = _.filter(devices, (d) => d.kind === 'audioinput');
                    const videoDevices = _.filter(devices, (d) => d.kind === 'videoinput');
                    let audioDevice = _.find(audioDevices, (d) => d.deviceId === micDeviceId);
                    let videoDevice = _.find(videoDevices, (d) => d.deviceId === camDeviceId);

                    if(!audioDevice) {
                        audioDevice = _.find(audioDevices, (d) => d.deviceId === 'default');
                    }
                    if(!videoDevice) {
                        videoDevice = _.find(videoDevices, (d) => d.deviceId === 'default');
                    }

                    if((!audioDevice) && audioDevices && (audioDevices.length > 0)) {
                        audioDevice = audioDevices[0];
                    }
                    if((!videoDevice) && videoDevices && (videoDevices.length > 0)) {
                        videoDevice = videoDevices[0];
                    }

                    resolve({
                        audioDeviceId: audioDevice ? audioDevice.deviceId : '',
                        videoDeviceId: videoDevice ? videoDevice.deviceId : '',
                    });
                } catch(error) {
                    console.log(LogPrefix, 'GetUsableVideoDevice error : ', error);

                    reject(error);
                }
            } else {
                console.log(LogPrefix, 'No EnumerateDevices');

                reject(new Error('No EnumerateDevices'));
            }
        });
    }

    static getUserVideoStream(videoDeviceId, maxMediaQuality) {
        return new Promise(async (resolve, reject) => {
            if(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const qualities = MediaUtil.getQualities(MediaQuality.VeryHigh);
                console.log(LogPrefix, 'GetUserVideoStream : quality=', maxMediaQuality, ', qualities=', qualities);

                const maxQualityInfo = MediaUtil.getQualityInfo(maxMediaQuality);
                if(qualities && (qualities.length > 0)) {
                    for(let i=0; i<qualities.length; i++) {
                        const q = qualities[i];

                        try {
                            const {stream, width, height} = await MediaUtil.getUserVideoStreamStrictly(videoDeviceId, q.width, q.height);
                            console.log(LogPrefix, `GetUserVideoStream success : width=${width}, height=${height}, stream=`, stream);

                            let clonedWidth, clonedHeight, clonedStream;
                            if((width < maxQualityInfo.width) && (height < maxQualityInfo.width)) {
                                clonedStream = await MediaUtil.cloneStream(stream);
                            } else {
                                clonedStream = await MediaUtil.cloneStream(stream, maxQualityInfo);
                            }
                            console.log(LogPrefix, 'GetUserVideoStream clone success');
                            const clonedVideoTracks = clonedStream.getVideoTracks();
                            if(clonedVideoTracks && (clonedVideoTracks.length > 0)) {
                                const clonedFirstTrack = clonedVideoTracks[0];
                                const clonedSettings = clonedFirstTrack.getSettings();

                                clonedWidth = clonedSettings.width;
                                clonedHeight = clonedSettings.height;
                            } else {
                                clonedWidth = 0;
                                clonedHeight = 0;
                            }

                            stream.getTracks().forEach((track) => track.stop());
                            resolve({stream: clonedStream, width: clonedWidth, height: clonedHeight});
                            break;
                        } catch(error) {
                            if(error && error.message && ((error.message === 'NotMatchedWidthOrHeight') || (error.message === 'NoVideoTrack'))) {
                                console.log(LogPrefix, `GetUserVideoStream error : width=${q.width}, height=${q.height}`)
                                continue;
                            } else {
                                console.log(LogPrefix, 'GetUserVideoStream error', error);

                                reject(error);
                                break;
                            }
                        }
                    }
                } else {
                    console.log(LogPrefix, 'GetUserVideoStream error : No available media quality');
                    reject(new Error("No available media quality"));
                }
            } else {
                console.log(LogPrefix, 'GetUserVideoStream error : No GetUserMedia');
                reject(new Error('No GetUserMedia or No DeviceId'));
            }
        });
    }

    static getUserAudioStream(audioDeviceId) {
        return new Promise(async (resolve, reject) => {
            console.log(LogPrefix, 'GetUserAudioStream : ', audioDeviceId);

            if(audioDeviceId && navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const audioConstraints = audioDeviceId ? {deviceId: audioDeviceId, echoCancellation: true, noiseSuppression: false} : {echoCancellation: true, noiseSuppression: false};

                    const  stream = await navigator.mediaDevices.getUserMedia({audio: audioConstraints, video: false});
                    console.log(LogPrefix, 'GetUserMedia success with constraints', audioConstraints);

                    resolve(stream);
                } catch(error) {
                    console.log(LogPrefix, 'GetUserMedia error', error);

                    reject(error);
                }
            } else {
                console.log(LogPrefix, 'GetUserMedia error : No GetUserMedia or No DeviceId');

                reject(new Error('No GetUserMdia or No DeviceId'));
            }

        });
    }

    static getUsableAudioDeviceId(deviceId) {
        return new Promise(async (resolve, reject) => {
            if(navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const audioDevices = _.filter(devices, (d) => d.kind === 'audioinput');
                    let audioDeviceId = undefined;
                    if(audioDevices) {
                        if(audioDevices.find(device => device.deviceId === deviceId)) {
                            audioDeviceId =  deviceId;
                        } else if(audioDevices.find(device => device.deviceId === 'default')) {
                            audioDeviceId = 'default';
                        } else if(audioDevices.length > 0) {
                            audioDeviceId = devices[0].deviceId;
                        }
                    }

                    resolve(audioDeviceId ? audioDeviceId : '');
                } catch(error) {
                    console.log(LogPrefix, 'GetUsableVideoDevice error : ', error);

                    reject(error);
                }
            } else {
                console.log(LogPrefix, 'No EnumerateDevices');

                reject(new Error('No EnumerateDevices'));
            }
        });
    }

    static getUserVideoStreamStrictly(videoDeviceId, videoWidth, videoHeight) {
        return new Promise(async (resolve, reject) => {
            const videoConstraints = videoDeviceId ? {
                deviceId: videoDeviceId,
                width: videoWidth,
                aspectRatio: videoWidth / videoHeight,
                frameRate: 30,
            } : {
                width: videoWidth,
                aspectRatio: videoWidth / videoHeight,
                frameRate: 30,
            };
            const constraints = {
                audio: false,
                video: videoConstraints,
            };

            try {
                console.log(LogPrefix, 'GetUserMedia with constraints : audio=false, video=', videoConstraints);

                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                const videoTracks = stream.getVideoTracks();
                if(videoTracks && (videoTracks.length > 0)) {
                    const firstTrack = videoTracks[0];
                    const settings = firstTrack.getSettings();
                    const width = settings.width;
                    const height = settings.height;

                    if(width && height && ((width === videoWidth) || (height === videoWidth))) {
                        resolve({stream, width, height});
                    } else {
                        console.warn(LogPrefix, `NotMatchedWidthOrHeight : request=(${videoWidth}, ${videoHeight}), result=(${width}, ${height})`);

                        stream.getTracks().forEach(t => t.stop());
                        reject(new Error('NotMatchedWidthOrHeight'));
                    }
                } else {
                    console.warn(LogPrefix, `NoVideoTrack`);

                    stream.getTracks().forEach(t => t.stop());
                    reject(new Error('NoVideoTrack'));
                }
            } catch(error) {
                reject(error);
            }
        });
    }

    static cloneStream(stream, qualityInfo) {
        return new Promise((resolve, reject) => {
            const clone = stream.clone();
            console.log(LogPrefix, 'Stream cloned', clone);

            const videoTracks = clone.getVideoTracks();
            if(videoTracks && (videoTracks.length > 0)) {
                const firstTrack = videoTracks[0];

                if(qualityInfo) {
                    const videoConstraints = {
                        width: qualityInfo.width,
                        height: qualityInfo.height,
                        frameRate: qualityInfo.frameRate,
                        resizeMode: 'crop-and-scale',
                    };

                    console.log(LogPrefix, `CloneStream : ApplyConstraints, constraints=`, videoConstraints);
                    firstTrack.applyConstraints(videoConstraints)
                        .then(() => {
                            console.log(LogPrefix, `CloneStream : ApplyConstraints success`, videoConstraints);

                            resolve(clone);
                        })
                        .catch(error => {
                            reject(error);
                        });
                } else {
                    console.log(LogPrefix, `CloneStream : NoApplyConstraints : Just clone`);

                    resolve(clone);
                }
            } else {
                reject(new Error('NoVideoTrack'));
            }
        });
    }
}