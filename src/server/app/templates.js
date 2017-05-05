const templates = {
  newGroup: (to, link, inviter, name) => `
<html>

<head>
    <link href="https://fonts.googleapis.com/css?family=Fredoka+One|Raleway:300" rel="stylesheet">
    <style>
    body {
        margin: 0px auto;
    }
    
    .header {
        width: 100%;
        height: 50px;
        background-color: #026AA7;
        color: white;
        font-size: 24px;
        font-family: 'Fredoka One', sans-serif;
    }
    
    .header p {
        padding: 10px 10px;
    }
    
    .main {
        margin: 50px;
        padding: 10px;
        font-family: 'Fredoka One', sans-serif;
    }

    .container .buttons {
    	display: flex;
    	flex-wrap: wrap;
    }
    
    .container p {
        font-family: 'Raleway', sans-serif!important;
        margin-top: 30px;
        margin-bottom: 30px;
    }

    .button {
    	margin-top: 15px;
    }
    
    .button a {
        border-radius: 15px;
        padding: 5px 20px;
        font-family: 'Fredoka One';
        font-size: 20px;
        cursor: pointer;
    }

    .join {
    	box-shadow: 1px 1px 3px #e1e1e1;
        background: #F8AF3E;
        color: white;
    }
    
    .learn {
        color:  #026AA7;
    }

    footer {
        font-family: 'Arial', sans-serif!important;
        font-size: 12px;
        color: gray;
        margin-top: 40px;
    }
    
    a,
    a:active,
    a:visited,
    a:hover {
        color: #026AA7;
        text-decoration: none;
    }
    </style>
</head>

<body>
    <div class="header">
        <p>QUVL</p>
    </div>
    <div class="main">
        <h1>Join a writing group on QUVL!</h1>
        <div class="container">
            <p>You have been invited by ${inviter} to join a new writing group called "${name}".</p>
            <div class="buttons">
	            <div class="button"><a class="join" href="${link}">Join Now!</a></div>
	            <div class="button"><a class="learn" href="https://quvl.io">What's QUVL?</a></div>
            </div>
        </div>
        <footer>
            <hr /> This message was sent to ${to}. If you don't want to receive these emails from quvl in the future, please <a href="https://quvl.io/unsubscribe/${to}">unsubscribe</a>.
            <br />Grannysoft, LLC., Attention: Community Support, 1249 Dean St BSMT, Brooklyn NY 11216.
        </footer>
    </div>
</body>

</html>
`
};

export default templates;
