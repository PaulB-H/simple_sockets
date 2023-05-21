<h1>Simple Sockets</h1>
<img src="https://raw.githubusercontent.com/PaulB-H/simple_sockets/main/simplesockets.png" />

<h5><small>Made with:</small><br /> HTML, CSS, JS, Node.JS</h5>

<p>
  <a href="https://paulbh.com/simplesockets" target="_blank">
    simple-sockets
  </a>
  <br />
  <small><sup>
    <strike>Heroku free tier gone... Not redeployed yet...</strike><br />
    Redeployed on my server
   </sup></small>
</p>

<h2>Description</h2>
<p>A lightweight chat application using Socket.IO</p>

<h2>Details</h2>

<ul>
	<li>Set a username, then join or create a room</li>
	<li>Rooms can have passwords</li>
	<li>No account / signup required</li>
	<li>Usernames are freed when you disconnect</li>
	<li>Rooms with 0 users are deleted</li>
</ul>

<p><strong>Some specific functionality I wanted:</strong></p>
<ul>
	<li>Multi-line input</li>
	<li>
		Enter key functionality:
		<ul>
			<li>On mobile, insert line break</li>
    		<li>On desktop, send message</li>
    	</ul>
	</li>
	<li>Shift + Enter on desktop to insert line break</li>
	<li>Expanding textarea**</li>
</ul>

<p><small><em>* Normally a textarea does not auto-resize, I found a hack to create a "shadow clone" that matches the content of the textarea, becomes visible briefly to get a height, sets the hight of the real textarea to match, before hiding again.</em></small></p>

<h5>Profanity filtering</h5>
<p>Currently this is only enabled for usernames, I am interested in a more efficient way to do long messages.</p>

<h2>Libraries / Frameworks / Packages</h2>
<ul>

  <li>
    <a href="https://www.npmjs.com/package/socket.io" target="_blank">
      Socket.io
    </a>
  </li>

  <li>
    <a href="https://www.npmjs.com/package/express" target="_blank">
      Express
    </a>
  </li>
  
  <li>
    <a href="https://www.npmjs.com/package/validator" target="_blank">
      Validator
    </a>
  </li>
  
  <li>
    <a href="https://www.npmjs.com/package/bcrypt" target="_blank">
      Bcrypt
    </a>
  </li>
  
  <li>
    <a href="https://dashboard.heroku.com/" target="_blank">
      Heroku
    </a>
  </li>

</ul>
