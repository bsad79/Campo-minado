const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const formData = new FormData(form);

   
    const userName = formData.get('user');
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('User:', userName);
    console.log('Email:', email);
    console.log('Password:', password);

    
});


