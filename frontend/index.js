import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
  quill = new Quill('#editor', {
    theme: 'snow'
  });

  const newPostBtn = document.getElementById('newPostBtn');
  const postForm = document.getElementById('postForm');
  const submitPost = document.getElementById('submitPost');
  const postsContainer = document.getElementById('posts');

  newPostBtn.addEventListener('click', () => {
    postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
  });

  submitPost.addEventListener('click', async () => {
    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('postAuthor').value;
    const body = quill.root.innerHTML;

    if (title && author && body) {
      await backend.addPost(title, body, author);
      document.getElementById('postTitle').value = '';
      document.getElementById('postAuthor').value = '';
      quill.setContents([]);
      postForm.style.display = 'none';
      await displayPosts();
    } else {
      alert('Please fill in all fields');
    }
  });

  await displayPosts();
});

async function displayPosts() {
  const posts = await backend.getPosts();
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';

  posts.sort((a, b) => b.timestamp - a.timestamp).forEach(post => {
    const postElement = document.createElement('article');
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p class="author">By ${post.author}</p>
      <div class="post-body">${post.body}</div>
      <p class="timestamp">${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
    `;
    postsContainer.appendChild(postElement);
  });
}
