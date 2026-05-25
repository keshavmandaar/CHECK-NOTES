/* ELEMENTS */

const notesContainer =
    document.getElementById('notesContainer');

const noteInput =
    document.getElementById('noteInput');

const loginBtn =
    document.querySelector('.login-btn');

const signupBtn =
    document.querySelector('.signup-btn');

const logoutBtn =
    document.querySelector('.logout-btn');

/* USER STATE */

let currentUser =
    localStorage.getItem('currentUser');

/* NOTES */

function getNotes(){

    if(!currentUser){
        return [];
    }

    return JSON.parse(
        localStorage.getItem(
            `notes_${currentUser}`
        )
    ) || [];
}

function saveNotes(notes){

    localStorage.setItem(
        `notes_${currentUser}`,
        JSON.stringify(notes)
    );
}

/* UPDATE UI */

function updateUI(){

    if(currentUser){

        loginBtn.style.display = 'none';

        signupBtn.style.display = 'none';

        logoutBtn.style.display = 'inline-block';

        noteInput.disabled = false;

        renderNotes();

    }else{

        loginBtn.style.display = 'inline-block';

        signupBtn.style.display = 'inline-block';

        logoutBtn.style.display = 'none';

        noteInput.disabled = true;

        notesContainer.innerHTML = `
            <div class="note-item">
                <div class="note-text">
                    Please Login To Access Notes
                </div>
            </div>
        `;
    }
}

/* SIGNUP */

signupBtn.addEventListener('click', ()=>{

    const username =
        prompt('Create Username');

    const password =
        prompt('Create Password');

    if(!username || !password){

        alert('All fields required');

        return;
    }

    const users =
        JSON.parse(
            localStorage.getItem('users')
        ) || {};

    if(users[username]){

        alert('User already exists');

        return;
    }

    users[username] = password;

    localStorage.setItem(
        'users',
        JSON.stringify(users)
    );

    alert('Signup Successful');

});

/* LOGIN */

loginBtn.addEventListener('click', ()=>{

    const username =
        prompt('Enter Username');

    const password =
        prompt('Enter Password');

    const users =
        JSON.parse(
            localStorage.getItem('users')
        ) || {};

    if(users[username] === password){

        localStorage.setItem(
            'currentUser',
            username
        );

        currentUser = username;

        alert(`Welcome ${username}`);

        updateUI();

    }else{

        alert('Invalid Username or Password');
    }
});

/* LOGOUT */

logoutBtn.addEventListener('click', ()=>{

    localStorage.removeItem(
        'currentUser'
    );

    currentUser = null;

    alert('Logged Out');

    updateUI();
});

/* RENDER NOTES */

function renderNotes(){

    const notes = getNotes();

    notesContainer.innerHTML = '';

    if(notes.length === 0){

        notesContainer.innerHTML = `
            <div class="note-item">
                <div class="note-text">
                    No Notes Available
                </div>
            </div>
        `;

        return;
    }

    notes.forEach((note,index)=>{

        const noteDiv =
            document.createElement('div');

        noteDiv.className = 'note-item';

        noteDiv.innerHTML = `
            <div class="note-text">
                ${note}
            </div>

            <div class="actions">

                <button
                    class="edit-btn"
                    onclick="editNote(${index})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteNote(${index})"
                >
                    Delete
                </button>

            </div>
        `;

        notesContainer.appendChild(noteDiv);

    });
}

/* ADD NOTE */

function addNote(){

    if(!currentUser){

        alert('Please Login First');

        return;
    }

    const text =
        noteInput.value.trim();

    if(text === ''){

        alert('Write something');

        return;
    }

    const notes = getNotes();

    notes.unshift(text);

    saveNotes(notes);

    noteInput.value = '';

    renderNotes();
}

/* DELETE NOTE */

function deleteNote(index){

    const notes = getNotes();

    notes.splice(index,1);

    saveNotes(notes);

    renderNotes();
}

/* EDIT NOTE */

function editNote(index){

    const notes = getNotes();

    const updatedText =
        prompt(
            'Edit Note',
            notes[index]
        );

    if(updatedText !== null){

        notes[index] = updatedText;

        saveNotes(notes);

        renderNotes();
    }
}

/* INITIAL LOAD */

updateUI();