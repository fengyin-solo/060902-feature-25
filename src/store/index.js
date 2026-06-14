import { reactive } from 'vue'

const initialDemoPosts = [
  {
    id: 'demo1',
    message: '想你了，真的好想好想',
    date: Date.now() - 86400000,
    isSent: false,
    context: null,
    tags: [{ type: 'miss', text: '思念' }],
    guesses: [
      { id: 'g1', text: '应该是异地恋，好久没见了吧？', likes: 12, date: Date.now() - 7200000 },
      { id: 'g2', text: '会不会是刚吵架和好？', likes: 8, date: Date.now() - 3600000 }
    ],
    anonymous: true,
    originalConversation: null,
    revealThreshold: 5,
    realContext: {
      prev: '今天工作遇到好多烦心事...',
      next: '我也是，特别想见你，周末一起吃饭好吗？'
    }
  },
  {
    id: 'demo2',
    message: '晚安，梦里见 🌙',
    date: Date.now() - 86400000 * 2,
    isSent: true,
    context: {
      prev: '今天好累啊，先睡了',
      next: '晚安呀，明天见 ❤️'
    },
    tags: [{ type: 'night', text: '晚安' }],
    guesses: [
      { id: 'g3', text: '好甜！应该是热恋期吧', likes: 25, date: Date.now() - 86400000 }
    ],
    anonymous: true,
    originalConversation: null,
    revealThreshold: 5,
    realContext: {
      prev: '今天好累啊，先睡了',
      next: '晚安呀，明天见 ❤️'
    }
  },
  {
    id: 'demo3',
    message: '对不起，我错了还不行吗 😢',
    date: Date.now() - 86400000 * 3,
    isSent: true,
    context: null,
    tags: [{ type: 'sorry', text: '道歉' }],
    guesses: [
      { id: 'g4', text: '是不是又忘了什么纪念日？', likes: 32, date: Date.now() - 86400000 * 2 },
      { id: 'g5', text: '我猜是打游戏忘了回消息', likes: 28, date: Date.now() - 86400000 * 2 + 3600000 },
      { id: 'g6', text: '感觉是惹女朋友生气了哈哈哈', likes: 19, date: Date.now() - 86400000 }
    ],
    anonymous: true,
    originalConversation: null,
    revealThreshold: 5,
    realContext: {
      prev: '你自己说过多少次了？每次都这样！',
      next: '唉...下次我一定记得，别生气了好不好？'
    }
  }
]

export const store = reactive({
  conversations: [],
  selectedConversation: null,
  loveLetters: [],
  anonymousPosts: [],
  demoPosts: JSON.parse(JSON.stringify(initialDemoPosts)),
  processing: false,
  error: null,

  setConversations(convs) {
    this.conversations = convs
  },

  setLoveLetters(letters) {
    this.loveLetters = letters
  },

  setSelectedConversation(conv) {
    this.selectedConversation = conv
  },

  addAnonymousPost(post) {
    if (!post.revealThreshold) {
      post.revealThreshold = 5
    }
    this.anonymousPosts.unshift(post)
  },

  getPostById(id) {
    let post = this.anonymousPosts.find(p => p.id === id)
    if (!post) {
      post = this.demoPosts.find(p => p.id === id)
    }
    return post
  },

  addGuess(postId, guessText) {
    const post = this.getPostById(postId)
    if (!post) return null

    const guess = {
      id: Math.random().toString(36).substr(2, 9),
      text: guessText.trim(),
      likes: 0,
      liked: false,
      date: Date.now()
    }

    post.guesses.push(guess)

    const threshold = post.revealThreshold || 5
    if (post.guesses.length >= threshold && !post.context) {
      if (post.realContext) {
        post.context = { ...post.realContext }
      } else {
        post.context = {
          prev: '这是上一条消息的内容',
          next: '这是下一条消息的内容'
        }
      }
      console.log(`[Guess] Post ${postId} auto-revealed after ${post.guesses.length} guesses`)
    }

    return guess
  },

  toggleLike(postId, guessId) {
    const post = this.getPostById(postId)
    if (!post) return

    const guess = post.guesses.find(g => g.id === guessId)
    if (!guess) return

    if (guess.liked) {
      guess.likes--
      guess.liked = false
    } else {
      guess.likes++
      guess.liked = true
    }
  },

  revealContext(postId) {
    const post = this.getPostById(postId)
    if (!post || post.context) return false

    if (post.realContext) {
      post.context = { ...post.realContext }
    } else {
      post.context = {
        prev: '这是上一条消息的内容',
        next: '这是下一条消息的内容'
      }
    }
    console.log(`[Guess] Post ${postId} manually revealed`)
    return true
  },

  setProcessing(val) {
    this.processing = val
  },

  setError(err) {
    this.error = err
  },

  clearAll() {
    this.conversations = []
    this.selectedConversation = null
    this.loveLetters = []
    this.error = null
  }
})
