// 图片
const musicImg = document.querySelector('.music-image')

// 标题
const title = document.querySelector('.music-title')
// 作者
const author = document.querySelector('.music-author')

// 重复播放
const repeatBtn = document.querySelector('.repeat')
// 是否喜欢
const isLikeBtn = document.querySelector('.active')
// 音量
const volumeBtn = document.querySelector('.volume')

// 控制音量盒子显示隐藏
const musicVolumeBox = document.querySelector('.music-volume-box')
// 音量控制器
const volume = document.querySelector('#music-volume')
// 减音量
const subVolume = document.querySelector('.volume-down')
// 加音量
const addVolume = document.querySelector('.volume-up')

// 音乐进度条
const musicProgress = document.querySelector('#music-progress')
const nowTime = document.querySelector('.now-time')
const endTime = document.querySelector('.end-time')

// 播放、暂停
const Play = document.querySelector('.play')
// 切换歌曲
const lastBtn = document.querySelector('.last-btn')
const nextBtn = document.querySelector('.next-btn')

// 音乐组件
const audio = new Audio()
audio.volume = 0.8 // 设置默认音量
let isPlay = false // 判断是否播放

// 音乐详情
const musicList = [
  {
    imgUrl: './img/Numb.jpg',
    name: 'Numb',
    author: 'Linkin Park',
    music: './mp3/Numb.mp3'
  },
  {
    imgUrl: './img/in the end.png',
    name: 'In The End',
    author: 'Linkin Park',
    music: './mp3/in the end.mp3'
  },
  {
    imgUrl: '',
    name: 'See You Again',
    author: 'Linkin Park',
    music: './mp3/see you again.mp3'
  }
]
// 当前播放的音乐
let nowMusic = 0

// 修改类名方法 dom对象  要修改的类名  添加还是移除
const classHandler = (dom, className, add) => {
  if (add) {
    dom.classList.add(className)
  } else {
    dom.classList.remove(className)
  }
}

// 抛出时间格式方法 00:00
const timeHandler = time => {
  let minute = Math.floor(time / 60) + '' // 分钟
  let second = (time % 60) + '' // 秒

  // 为0时改成 00
  if (!minute) minute = '00'
  if (!second) second = '00'

  // time为 1个时 改为 0+time
  if (minute !== '00') {
    minute.toString().length === 1 ? (minute = '0' + minute) : minute
  }
  if (second !== '00') {
    second.toString().length === 1 ? (second = '0' + second) : second
  }

  return `${minute}:${second}`
}

// 设置定时器启动方法
const intervalStart = start => {
  let timeId = setInterval(() => {
    const playTime = Math.floor(audio.currentTime)
    // 设置当前播放时间
    nowTime.innerText = timeHandler(playTime)
    // 设置播放条时间
    musicProgress.value = playTime
    if (audio.ended) nextBtn.onclick()
    // 暂停是关闭定时器
    if (audio.paused) clearInterval(timeId)
  }, 1000)
}

// 音量修改方法
const volumeHandler = value => {
  if (value < 0 || value > 100) return
  audio.volume = value / 100
  volume.value = value
}

// 播放按钮处理
const handlePlay = () => {
  // 修改按钮样式
  Play.innerHTML = isPlay ? '<i class="material-icons">play_arrow</i>' : '<i class="material-icons">pause</i>'
  if (!isPlay) {
    audio.play() // 播放
    isPlay = true
    intervalStart()
  } else {
    audio.pause() // 暂停
    isPlay = false
  }
}

// 播放音乐方法
const playMusic = () => {
  let music = musicList[nowMusic]
  // 设置图片
  musicImg.src = music.imgUrl ? music.imgUrl : './img/d6106d3f500c22fbfa7f2e13d36d34d21229412811.jpg@.png'

  // 修改歌曲信息
  title.innerText = music.name ? music.name : '未知'
  author.innerText = music.author ? music.author : '未知'

  // 添加歌曲
  audio.src = music.music
  setTimeout(() => {
    const audioTime = Math.floor(audio.duration)
    // 设置音乐总时长
    endTime.innerText = timeHandler(audioTime)
    // 设置音乐条的时间刻度
    musicProgress.max = audioTime
  }, 100)
}

// ---------------功能按钮部分------------------
// 是否循环播放
repeatBtn.onclick = () => {
  if (!audio.loop) {
    classHandler(repeatBtn, 'red-color', true)
  } else {
    classHandler(repeatBtn, 'red-color', false)
  }
  audio.loop = !audio.loop
}

// 是否喜欢
let isLike = false
isLikeBtn.onclick = () => {
  if (!isLike) {
    classHandler(isLikeBtn, 'red-color', true)
  } else {
    classHandler(isLikeBtn, 'red-color', false)
  }
  isLike = !isLike
}

// 控制音量 -- 显示隐藏
let showVolume = false // 音量是否显示
volumeBtn.onclick = () => {
  if (!showVolume) {
    // 打开 音量进度条
    classHandler(musicVolumeBox, 'hidden-box', false)
    classHandler(volumeBtn, 'red-color', true)
    showVolume = true
  } else {
    // 关闭 音量进度条
    classHandler(musicVolumeBox, 'hidden-box', true)
    classHandler(volumeBtn, 'red-color', false)
    showVolume = false
  }
}

// 修改音量
volume.oninput = () => {
  volumeHandler(+volume.value)
}
subVolume.onclick = () => {
  volumeHandler((volume.value -= 20))
}
addVolume.onclick = () => {
  volumeHandler(parseInt(volume.value) + 20)
}

// 通过进度条修改播放进度
musicProgress.oninput = () => {
  audio.currentTime = musicProgress.value
  isPlay = false
  Play.onclick()
}

// 播放按钮点击
Play.onclick = () => {
  handlePlay()
}

// 上一曲
lastBtn.onclick = () => {
  nowMusic -= 1
  if (nowMusic < 0) nowMusic = musicList.length - 1

  playMusic()
  isPlay = false
  Play.onclick()
}
// 下一曲
nextBtn.onclick = () => {
  nowMusic += 1
  if (nowMusic === musicList.length) nowMusic = 0

  playMusic()
  isPlay = false
  Play.onclick()
}

// 默认播放第一个音乐
const load = () => {
  playMusic()
}
