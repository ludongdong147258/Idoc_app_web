require('../add/add.scss');
require('./details.scss');
require('./img-modal.scss');
angular.module('app.controllers')
    .controller('PatientInfoCtr', function($rootScope, $scope, $state, patientService, $stateParams, $ionicModal, popupService, errorHandler, $ionicActionSheet,$sce,$timeout) {
        // $cordovaImagePicker $cordovaCamera To ADD
        $scope.state = $stateParams.state;
        var obj = {
            validateInput: function() {
                if (!$scope.wordsInfo.wordTitle) {
                    popupService.open('标题不能为空!');
                    return false;
                }
                if (!$scope.wordsInfo.wordContent) {
                    popupService.open('内容不能为空!');
                    return false;
                }
                return true;
            },
            // 转换流程信息
            convertProgressInfo: function(progressInfo) {
                var that = this;
                angular.forEach(progressInfo.nodeList, function(item, index) {
                    item.showBottomBtns = false;
                    $scope.showBottomBtns = item.showBottomBtns;
                    item.nodeImg = that.getNodeImg(item);
                    item.nodeTime = new Date(parseInt(item.nodeTime) * 1000);
                    item.otherList = [], item.formList = [],
                        item.noticeList = [], item.taskList = [],
                        item.wordsList = [], item.wordList = [], item.imgList = [],
                        item.videoList = [], item.optList = [], item.dicomList = [];
                    angular.forEach(item.eventList, function(subItem, subIndex) {
                        switch (parseInt(subItem.eventType)) {
                            case 0:
                                item.otherList.push(subItem);
                                break;
                            case 1:
                                item.formList.push(subItem);
                                break;
                            case 2:
                                item.noticeList.push(subItem);
                                break;
                            case 3:
                                item.taskList.push(subItem);
                                break;
                            case 4:
                                item.wordsList.push(subItem);
                                break;
                            case 5:
                                item.wordList.push(subItem);
                                break;
                            case 6:
                                item.imgList.push(subItem);
                                break;
                            case 7:
                                item.videoList.push(subItem);
                                break;
                            case 8:
                                item.optList.push(subItem);
                                break;
                            case 9:
                                item.dicomList.push(subItem);
                                break;
                        }
                    })
                });
            },
            getNodeImg: function(node) {
                var nodeImg = '',
                    imgName = '';
                switch (parseInt(node.nodeType)) {
                    case 100: // 门诊
                        if (node.nodeState == 1) {
                            imgName = 'past－mz@2x.png';
                        } else if (node.nodeState == 2) {
                            imgName = 'now－mz@2x.png';
                        } else if (node.nodeState == 3) {
                            imgName = 'future－mz@2x.png';
                        }
                        break;
                    case 200: // 排队
                        if (node.nodeState == 1) {
                            imgName = 'past－pd@2x.png';
                        } else if (node.nodeState == 2) {
                            imgName = 'now－pd@2x.png';
                        } else if (node.nodeState == 3) {
                            imgName = 'future－pd@2x.png';
                        }
                        break;
                    case 300:
                        if (node.nodeState == 1) {
                            imgName = 'past－sq@2x.png';
                        } else if (node.nodeState == 2) {
                            imgName = 'now－sq@2x.png';
                        } else if (node.nodeState == 3) {
                            imgName = 'future－sq@2x.png';
                        }
                        break;
                    case 400:
                        if (node.nodeState == 1) {
                            imgName = 'past－sz@2x.png';
                        } else if (node.nodeState == 2) {
                            imgName = 'now－sz@2x.png';
                        } else if (node.nodeState == 3) {
                            imgName = 'future－sz@2x.png';
                        }
                        break;
                    case 500:
                        if (node.nodeState == 1) {
                            imgName = 'past－sh@2x.png';
                        } else if (node.nodeState == 2) {
                            imgName = 'now－sh@2x.png';
                        } else if (node.nodeState == 3) {
                            imgName = 'future－sh@2x.png';
                        }
                        break;
                    case 600:
                        if (node.nodeState == 1) {
                            imgName = 'past－sf@2x.png';
                        } else if (node.nodeState == 2) {
                            imgName = 'now－sf@2x.png';
                        } else if (node.nodeState == 3) {
                            imgName = 'future－sf@2x.png';
                        }
                        break;
                }
                nodeImg = require('../../../core/images/' + imgName);
                return nodeImg;
            }
        };
        // 返回
        $scope.back = function() {
            if ($stateParams.state) {
                $state.go($stateParams.state, $stateParams);
            }
        };
        var teamPid = $stateParams.teamPid;
        $scope.teamPid = teamPid;
        patientService.getPatientInfo(teamPid).success(function(data) {
            if (data.code == 200) {
                var patientInfo = data.patientInfo,
                    gender;
                switch (patientInfo.gender) {
                    case '1':
                        gender = '男';
                        break;
                    case '2':
                        gender = '女';
                        break;
                    case '3':
                        gender = '未知';
                        break;
                }
                patientInfo.gender = gender;
                $scope.patientInfo = patientInfo;
                obj.convertProgressInfo($scope.patientInfo.processDetailInfo);
            }
        }).error(errorHandler());
        $scope.showBottom = function(item, event) {
            event.stopPropagation();
            item.showBottomBtns = !item.showBottomBtns;
            $scope.showBottomBtns = item.showBottomBtns;
            if (item.showBottomBtns) {
                $scope.curItem = item;
            }
            $scope.displayMenus = false;
        };
        $ionicModal.fromTemplateUrl('words-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.wordsInfo = {
                isView: 0
            };
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        $scope.addWords = function() {
            var flag = obj.validateInput();
            if (flag) {
                var params = angular.extend($scope.wordsInfo, {
                    patientNodeId: $scope.curItem.patientNodeId,
                    teamPid: teamPid
                });
                patientService.addWords(params).success(function(data) {
                    if (data.code == 200) {
                        $scope.curItem.wordsList.push(data.eventInfo);
                        popupService.open('添加成功!');
                        $scope.closeModal();
                    }
                }).error(errorHandler());
            }
        };
        $scope.displayMenus = false;
        $scope.showMenus = function(event) {
            event.stopPropagation();
            $scope.displayMenus = !$scope.displayMenus;
            $scope.showBottomBtns = false;
            if ($scope.curItem) {
                $scope.curItem.showBottomBtns = false;
            }
        };
        $scope.hideMenus = function() {
            $scope.displayMenus = false;
            $scope.showBottomBtns = false;
            if ($scope.curItem) {
                $scope.curItem.showBottomBtns = false;
            }
        };
        $scope.changeProgress = function() {
            $scope.displayMenus = false;
            $scope.openTeamModal();
        };
        $scope.stopProgress = function() {
            $scope.displayMenus = false;
            popupService.confirm('流程终止后信息不会再更新并无法使用', '', '继续终止', '取消').then(function(res) {
                if (res) {
                    patientService.stopProgress(teamPid).success(function(data) {
                        if (data.code == 200) {
                            popupService.open('终止成功!');
                            $state.go($stateParams.state, $stateParams);
                        }
                    }).error(errorHandler());
                }
            });
        }
        $scope.goToPatientBaseInfo = function() {
            $state.go('patientBaseInfo', $stateParams);
        };
        $scope.showActionSheet = function() {
            var imgSheet = $ionicActionSheet.show({
                buttons: [{
                    text: '拍照'
                }, {
                    text: '从相册选择'
                }],
                cancelText: '取消',
                cancel: function() {
                    imgSheet();
                },
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            $scpoe.takePhoto();
                            break;
                        case 1:
                            $scpoe.pickImage();
                            break;
                    }
                    return true;
                }
            });
        };
        // 选择图片
        $scope.image_list = [];

        $scope.pickImage = function() {
            window.imagePicker.getPictures(
                function(results) {
                    $scope.image_list = results;
                    if(arguments.length == 0) {
                        openImgModal();
                    }
                },
                function(error) {
                    console.log('Error: ' + error);
                }
            );
        }
        var imgModal = $ionicModal.fromTemplate(require('./img-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        openImgModal = function() {
            imgModal.show();
        };
        $scope.closeImgModal = function() {
            imgModal.hide();
        };
        $scope.$on('$destroy', function() {
            imgModal.remove();
            noticeViewModal.remove();
            wordsViewModal.remove();
            taskViewModal.remove();
            imgViewModal.remove();
            videoViewModal.remove();
        });
        $scope.videoSrc;
        // 相机
        $scope.takePhoto = function(mediaType) {
            var options = {
                //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
                quality: 100, //相片质量0-100
                destinationType: Camera.DestinationType.FILE_URI, //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                sourceType: Camera.PictureSourceType.CAMERA, //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                allowEdit: false, //在选择之前允许修改截图
                encodingType: Camera.EncodingType.JPEG, //保存的图片格式： JPEG = 0, PNG = 1
                targetWidth: 200, //照片宽度
                targetHeight: 200, //照片高度
                mediaType: mediaType || 0, //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                cameraDirection: 0, //枪后摄像头类型：Back= 0,Front-facing = 1
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true //保存进手机相册
            };
            window.camera.getPicture(options).then(function(imageData) {
                if(mediaType) {
                    $scope.videoSrc = $sce.trustAsResourceUrl(imageData);
                }else{
                    $scope.image_list.push(imageData);
                }
            }, function(err) {
                alert(error);
            });
        };
        // 须知查看modal
        var noticeViewModal = $ionicModal.fromTemplate(require('./notice-view-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openNoticeViewModal = function(item) {
            patientService.viewNotice({
                patientEventId: item.patientEventId
            }).success(function(data) {
                $scope.noticeInfo = data.noticeInfo;
                noticeViewModal.show();
                item.isRead = 1;
            }).error(errorHandler());
        };
        $scope.closeNoticeViewModal = function() {
            noticeViewModal.hide();
        };
        // 文字查看modal
        var wordsViewModal = $ionicModal.fromTemplate(require('./words-view-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openWordsViewModal = function(item) {
            patientService.viewWords({
                patientEventId: item.patientEventId
            }).success(function(data) {
                $scope.wordsInfo = data.wordInfo;
                wordsViewModal.show();
            }).error(errorHandler());
        };
        $scope.closeWordsViewModal = function() {
            wordsViewModal.hide();
        };
        // 任务查看modal
        var taskViewModal = $ionicModal.fromTemplate(require('./task-view-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openTaskViewModal = function(item) {
            patientService.viewTask({
                patientEventId: item.patientEventId
            }).success(function(data) {
                $scope.taskInfo = data.taskInfo;
                taskViewModal.show();
                item.isRead = 1;
            }).error(errorHandler());
        };
        $scope.closeTaskViewModal = function() {
            taskViewModal.hide();
        };
        // 图片查看 modal
        var imgViewModal = $ionicModal.fromTemplate(require('./img-view-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openImgViewModal = function(item) {
            $scope.targetImgUrl = item.eventTargetUrl;
            $scope.imgTitle = item.eventTitle;
            imgViewModal.show();
        };
        $scope.closeImgViewModal = function() {
            imgViewModal.hide();
        };
        // 视频查看 modal
        var videoViewModal = $ionicModal.fromTemplate(require('./video-view-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openVideoViewModal = function(item) {
            $scope.targetVideoUrl = $sce.trustAsResourceUrl(item.eventTargetUrl);
            $scope.videoTitle = item.eventTitle;
            videoViewModal.show();
        };
        $scope.closeVideoViewModal = function() {
            videoViewModal.hide();
        };
        // 视频上传 modal
        var videoModal = $ionicModal.fromTemplate(require('./video-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openVideoModal = function(item) {
            videoModal.show();
        };
        $scope.closeVideoModal = function() {
            videoModal.hide();
        };

        // 选择团队流程modal
        var teamModal = $ionicModal.fromTemplate(require('../add/team-modal.html'), {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openTeamModal = function(){
            $scope.teamInfo = {};
            $scope.team = {};
            $scope.process = {};
            $scope.processDetails = {};
            patientService.getTeamList().success(function(data) {
                $scope.teamList = data.teamList;
            }).error(errorHandler());
            teamModal.show();
        };
        $scope.closeTeamModal = function(){
            teamModal.hide();
        };
        $scope.data = {};
        $scope.showTeam = false;
        $scope.showTeamList = function() {
            $scope.showTeam = !$scope.showTeam;
        };
        $scope.hideTeamList = function() {
            $scope.showTeam = false;
        };
        $scope.selectTeam = function(item) {
            $scope.team = item;
            $scope.showTeam = false;
            patientService.getProcessList(item.k).success(function(data) {
                $scope.processList = data.teamProcessList;
            }).error(errorHandler());
        };
        $scope.showProcess = false;
        $scope.showProcessList = function() {
            $scope.showProcess = !$scope.showProcess;
        };
        $scope.hideProcessList = function() {
            $scope.showProcess = false;
        };
        $scope.selectProcess = function(item) {
            $scope.process = item;
            $scope.showProcess = false;
            patientService.getProcessDetailsList($scope.team.k, item.k).success(function(data) {
                $scope.processDetailsList = data.teamProcessDetailList;
            }).error(errorHandler());
        };
        $scope.showProcessDetails = false;
        $scope.showProcessDetailsList = function() {
            $scope.showProcessDetails = !$scope.showProcessDetails;
        };
        $scope.hideProcessDetailsList = function() {
            $scope.showProcessDetails = false;
        };
        $scope.selectProcessDetails = function(item) {
            $scope.processDetails = item;
            $scope.showProcessDetails = false;
        };
        $scope.addFromUser = function(){
            if(!$scope.team.k) {
                popupService.open('请选择团队!');
                return;
            }
            if(!$scope.process.k) {
                popupService.open('请选择基本流程!');
                return;
            }
            if(!$scope.processDetails.k) {
                popupService.open('请选择详细流程!');
                return;
            }
            popupService.confirm('是否立即退出此次编辑?', '', '继续编辑', '退出').then(function(res) {
                if (res) {
                    patientService.changeProgress(teamPid, $scope.processDetails.k).success(function(data) {
                        if (data.code == 200) {
                            popupService.open('更改成功!');
                            teamModal.hide();
                            $timeout(function(){
                                $state.go($stateParams.state, $stateParams);
                            },2000);
                        }
                    }).error(errorHandler());
                }
            });
        };
        $scope.uploadImg = function() {
            var params = {
                type:3003,
                "file[]": $scope.image_list,
                patientNodeId: $scope.curItem.patientNodeId,
                teamPid: teamPid
            };
            patientService.uploadFile(params).success(function(data){
                popupService.open('上传成功!');
                imgModal.hide();
            }).errro(errorHandler());;
        };
        $scope.uploadVideo = function() {
            var params = {
                type:3004,
                "file[]": $scope.videoSrc,
                patientNodeId: $scope.curItem.patientNodeId,
                teamPid: teamPid
            };
            patientService.uploadFile(params).success(function(data){
                popupService.open('上传成功!');
                videoModal.hide();
            }).errro(errorHandler());;
        };
    });
