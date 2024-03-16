from django.http import HttpResponse, JsonResponse
from AnilistPython import Anilist
from django.shortcuts import render

def get_anime(request,name):
    anilist = Anilist()
    ani_list = anilist.get_anime(name)
    return JsonResponse(ani_list)

def get_data(request):
    anilist = Anilist()
    t=request.POST.get('type')
    search=request.POST.get('search')
    if t=='anime':
        data=anilist.get_anime(search)
    elif t=='manga':
        data=anilist.get_manga(search)
    elif t=='character':
        data=anilist.get_character(search)
    else:
        data={'error':'Invalid Type'}
        return JsonResponse(data,status=400)
    data['type']=t
    return JsonResponse(data,status=200)

def home(request):
    return render(request, 'anime/home.html')


def search(request):
    return render(request, 'anime/search.html')