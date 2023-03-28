document.getElementById('1x-speed').addEventListener('click', () => {
    speedIndex = 0;
    currentSpeed = speeds[speedIndex];
    document.querySelectorAll('.speedbutton').forEach(button => {
      button.classList.remove('active');
    });
    document.getElementById('1x-speed').classList.add('active');
  });
  
  