from django.shortcuts import render
import psycopg2
# Create your views here.
from django.http import HttpResponse,JsonResponse
from django.shortcuts import redirect,render
from django.views.decorators.csrf import csrf_exempt
from Dao.Student import Student

@csrf_exempt
def modify_stu_list(request):
    try:
        or_sno=request.POST.get('or_sno')
        sno=request.POST.get('sno')
        sname = request.POST.get('sname')
        sage = request.POST.get('sage')
        sgender = request.POST.get('sgender')
        sdept = request.POST.get('sdept')

        stu=Student.objects.get(sno=or_sno)

        stu.sno=sno
        stu.sname=sname
        stu.gender=sgender
        stu.age=sage
        stu.department=sdept
        stu.save()


        return JsonResponse(
        {
                "code":0
            }
        )
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "code":1
            }
        )


@csrf_exempt
def query_stu_list(request):
    try:
        sno=request.POST.get('sno')
        stu=Student.objects.filter(sno=sno).values('sno','sname','age','department','gender')[0]
        result={"code":0,"sno":stu['sno'],"sname":stu['sname'],"sgender":stu['gender'],"sage":stu['age'],"sdept":stu["department"]};
        return JsonResponse(
            result
        )
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "code":1
            }
        )



@csrf_exempt
def add_stu_list(request):
    try:
        sno=request.POST.get('sno')
        sname = request.POST.get('sname')
        sage = request.POST.get('sage')
        sgender = request.POST.get('sgender')
        sdept = request.POST.get('sdept')
        stu=Student(sno=sno,sname=sname,age=sage,gender=sgender,department=sdept)
        stu.save()

        return JsonResponse(
        {
                "code":0
            }
        )
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "code":1
            }
        )


@csrf_exempt
def delete_stu_list(request):

    try:
        sno=request.POST.get('sno')
        stu=Student.objects.get(sno=sno)
        stu.delete()
        return JsonResponse(
            {
                    "code":0
                }
            )
    except Exception as e:
        print(e)
        return JsonResponse(
            {
                "code":1
            }
        )


@csrf_exempt
def get_stu_list(request):
    try:
        stu_list=Student.objects.values('sno','sname','age','gender','department')
        stu_list_back=[]
        for stu in stu_list:
            stu_back={
                "sno":stu['sno'],
                "sname":stu['sname'],
                "sage":stu['age'],
                "sgender":stu['gender'],
                "sdept":stu['department']
            }
            stu_list_back.append(stu_back)
        return JsonResponse({
            "stu_info":stu_list_back,
            "code":0
        })


    except Exception as e:
        print(e)
        return JsonResponse(
            {"code": 1}
        )


