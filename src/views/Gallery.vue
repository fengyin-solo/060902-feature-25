<template>
  <div class="gallery-page">
    <div class="gallery-header">
      <h2>🏛️ 匿名广场</h2>
      <p>看看别人挂出来的短信，猜猜上下文是什么</p>
    </div>

    <div v-if="allPosts.length === 0" class="empty-state">
      <div class="icon">📭</div>
      <h3>广场还空空的</h3>
      <p>去情书墙挂出第一条短信，让大家猜猜看吧！</p>
      <router-link to="/wall" class="btn btn-primary">去情书墙</router-link>
    </div>

    <div v-else class="posts-grid">
      <div 
        v-for="post in allPosts" 
        :key="post.id"
        class="post-card card"
      >
        <div class="post-header">
          <span class="post-date">{{ formatDate(post.date) }}</span>
          <span 
            v-if="post.isSent" 
            class="post-type sent"
          >📤 发出的短信</span>
          <span 
            v-else 
            class="post-type received"
          >📥 收到的短信</span>
        </div>

        <div class="post-message">
          "{{ post.message }}"
        </div>

        <div class="post-tags" v-if="post.tags.length > 0">
          <span 
            v-for="tag in post.tags" 
            :key="tag.type"
            class="tag"
            :class="'tag-' + tag.type"
          >
            {{ tag.text }}
          </span>
        </div>

        <div class="post-meta" v-if="!post.anonymous && post.originalConversation">
          <span>来自: {{ post.originalConversation }}</span>
        </div>

        <div class="post-stats">
          <span>💭 {{ post.guesses.length }} 个猜测</span>
          <span v-if="post.context" class="status-revealed">🔓 已揭晓</span>
          <span v-else class="status-pending">🔒 待揭晓</span>
        </div>

        <div v-if="!post.context" class="reveal-progress">
          <div class="progress-bar-mini">
            <div 
              class="progress-fill-mini" 
              :style="{ width: getProgressPercent(post) + '%' }"
            ></div>
          </div>
          <span class="progress-label">
            {{ post.guesses.length }} / {{ getRevealThreshold(post) }} 人
          </span>
        </div>

        <div class="post-actions">
          <router-link 
            :to="'/guess/' + post.id" 
            class="btn btn-primary"
          >
            我来猜猜 →
          </router-link>
          
          <button 
            v-if="!post.context"
            class="btn btn-secondary"
            @click="revealContext(post)"
          >
            揭晓答案
          </button>
        </div>

        <div v-if="post.context" class="context-reveal">
          <div class="context-section" v-if="post.context.prev">
            <label>👆 上一条：</label>
            <p>{{ post.context.prev }}</p>
          </div>
          <div class="context-section" v-if="post.context.next">
            <label>👇 下一条：</label>
            <p>{{ post.context.next }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { store } from '@/store'

const allPosts = computed(() => {
  return [
    ...store.anonymousPosts,
    ...store.demoPosts
  ].sort((a, b) => b.date - a.date)
})

function getRevealThreshold(post) {
  return post.revealThreshold || 5
}

function getProgressPercent(post) {
  const threshold = getRevealThreshold(post)
  return Math.min(100, (post.guesses.length / threshold) * 100)
}

function revealContext(post) {
  store.revealContext(post.id)
}

function formatDate(timestamp) {
  const d = new Date(timestamp)
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + ' 分钟前'
  }
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + ' 小时前'
  }
  if (diff < 86400000 * 7) {
    return Math.floor(diff / 86400000) + ' 天前'
  }
  
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

onMounted(() => {
})
</script>

<style scoped>
.gallery-page {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-header {
  text-align: center;
  margin-bottom: 2rem;
}

.gallery-header h2 {
  font-size: 2rem;
  color: var(--love-red);
  margin-bottom: 0.5rem;
}

.gallery-header p {
  color: var(--text-light);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.post-card {
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(231, 76, 60, 0.15);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-date {
  color: var(--text-light);
  font-size: 0.85rem;
}

.post-type {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.post-type.sent {
  background: #ffe5e5;
  color: var(--love-red);
}

.post-type.received {
  background: #f3e5f5;
  color: var(--accent);
}

.post-message {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-dark);
  padding: 1rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 1rem;
  font-style: italic;
}

.post-tags {
  margin-bottom: 1rem;
}

.post-meta {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.post-stats {
  display: flex;
  gap: 1.5rem;
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.post-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.context-reveal {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 8px;
  border-left: 3px solid var(--love-pink);
}

.context-section {
  margin-bottom: 0.75rem;
}

.context-section:last-child {
  margin-bottom: 0;
}

.context-section label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.context-section p {
  font-size: 0.95rem;
  color: var(--text-dark);
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
}

.status-revealed {
  color: #00B42A;
  font-weight: 600;
  background: #f0fff4;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.status-pending {
  color: #FF7D00;
  font-weight: 500;
  background: #fff7e6;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.reveal-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #fff5f5, #fff0f6);
  border-radius: 8px;
}

.progress-bar-mini {
  flex: 1;
  height: 6px;
  background: #ffe5e5;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill-mini {
  height: 100%;
  background: linear-gradient(90deg, var(--love-pink), var(--love-red));
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-label {
  font-size: 0.8rem;
  color: var(--love-red);
  font-weight: 600;
  white-space: nowrap;
}

.post-card:has(.status-revealed) {
  border: 2px solid #00B42A;
}

.post-card:has(.status-revealed)::after {
  content: '🎉';
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  background: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 180, 42, 0.3);
}

.post-card {
  position: relative;
}
</style>
