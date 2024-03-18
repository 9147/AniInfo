from django.http import HttpResponse, JsonResponse
from AnilistPython import Anilist
from django.shortcuts import render

def get_anime(request,name):
    anilist = Anilist()
    ani_list = anilist.get_anime(name)
    return JsonResponse(ani_list)

def get_data(request):
    if request.method != 'POST':
        return HttpResponse(status=400)
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

def get_anime(request):
    if request.method != 'POST':
        return HttpResponse(status=400)
    # print(request.POST)
    anilist = Anilist()
    geners=request.POST.getlist('genres[]')
    years=[int(a) for a in request.POST.getlist('years[]')]
    rating_start=int(request.POST.get('rating[start]'))
    rating_end=int(request.POST.get('rating[end]'))
    if 1944 in years:
        years.remove(1944)
    # print(geners,years,rating_start,type(rating_end),sep='\n')
    if rating_start==0 and rating_end==100:
        data = anilist.search_anime(genre=geners, year=years)
    if rating_start<0 or rating_end>100 or rating_start>rating_end:
        return JsonResponse({'error':'Invalid Rating'},status=400)
    data = anilist.search_anime(genre=geners, year=years, score=range(rating_start, rating_end+1))
    data = {'anime':data}
    return JsonResponse(data)