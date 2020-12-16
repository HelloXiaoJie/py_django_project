ps -aux | grep python|xargs kill -9
nohup python manage.py runserver 0.0.0.0:80 >djo.out 2>&1 &
