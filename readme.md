<h2>Simple Sockets</h2>

<h4>A lightweight Socket.io chat application</h4>
<p>My first project with Socket.io</p>

<hr />

<h4>Features</h4>
<p>Set a username, then join or create a room</p>
<p>Rooms can have passwords</p>
<p>No account / signup required</p>
<p>Usernames are freed when you disconnect</p>
<p>Rooms with 0 users are deleted</p>
<p>DB-less</p>

<hr />

<p>Text input is obviously an important part of a chat application, there is some functionality that is important to me.</p>
<p>Multi-line input</p>
<p>Enter on mobile inserts line break, while enter on desktop sends message</p>
<p>Shift + Enter on desktop to insert line break</p>
<p>Expanding textarea<br />While normally textarea does not auto-resize, I found a method/script that creates a "shadow clone" that matches the content of the textarea, becomes visible for a second to grab the height, and then sets the hight of the textarea appropriately.</p>

<hr />

<h4>Profanity filtering</h4>
<p>Currently this is only enabled for usernames. The implementation I attempted for messages was too taxing on the server for messages of 2000+ characters.</p>

<h3>
  <a href="https://simple-sockets.herokuapp.com/" target="_blank">
    Live site
  </a>
</h3>
<p>*May require 10 seconds for Heroku server to start</p>

<hr />

<h4>Made with:</h4>
<ul>

  <li>
    <a href="https://nodejs.org/en/" target="_blank">
      Node.js
    </a>
    <ul>
      <li>Server foundation</li>
	  </ul>
  </li>
  
  <li>
    <a href="https://www.npmjs.com/package/express" target="_blank">
      Express
    </a>
    <ul>
      <li>Create HTTP server Socket.io attaches to</li>
    </ul>
  </li>
  
  <li>
    <a href="https://www.npmjs.com/package/socket.io" target="_blank">
      Socket.io
    </a>
    <ul>
      <li>Library for websockets</li>
    </ul>
  </li>
  
  <li>
    <a href="https://www.npmjs.com/package/validator" target="_blank">
      Validator
    </a>
    <ul>
      <li>Escape user input</li>
    </ul>
  </li>
  
  <li>
    <a href="https://www.npmjs.com/package/bcrypt" target="_blank">
      Bcrypt
    </a>
    <ul>
      <li>Hash & Salt user passwords</li>
    </ul>
  </li>
  
  <li>
    <a href="https://dashboard.heroku.com/" target="_blank">
      Heroku
    </a>
    <ul>
      <li>Live Deployment</li>
    </ul>
  </li>

</ul>
