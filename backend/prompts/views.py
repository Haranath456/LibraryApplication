"""
Views for prompt API endpoints.
"""

import json
import redis
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from prompts.models import Prompt

# Initialize Redis connection
REDIS_URL = settings.REDIS_URL
redis_client = redis.from_url(REDIS_URL)


def get_redis_client():
    """
    Get or create Redis client connection.
    """
    try:
        redis_client.ping()
        return redis_client
    except Exception:
        return None


def validate_prompt_data(data):
    """
    Validate prompt input data.
    
    Returns:
        (is_valid: bool, errors: dict or None)
    """
    errors = {}
    
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    complexity = data.get('complexity')
    
    # Validate title
    if not title:
        errors['title'] = 'Title is required'
    elif len(title) < 3:
        errors['title'] = 'Title must be at least 3 characters'
    elif len(title) > 255:
        errors['title'] = 'Title must not exceed 255 characters'
    
    # Validate content
    if not content:
        errors['content'] = 'Content is required'
    elif len(content) < 20:
        errors['content'] = 'Content must be at least 20 characters'
    
    # Validate complexity
    if complexity is None:
        errors['complexity'] = 'Complexity is required'
    else:
        try:
            complexity_int = int(complexity)
            if complexity_int < 1 or complexity_int > 10:
                errors['complexity'] = 'Complexity must be between 1 and 10'
        except (ValueError, TypeError):
            errors['complexity'] = 'Complexity must be an integer'
    
    return len(errors) == 0, errors


@require_http_methods(["GET", "POST"])
@csrf_exempt
def prompt_list(request):
    """
    Handle GET (list all prompts) and POST (create new prompt) requests.
    
    GET /prompts/
    Returns list of prompts with id, title, complexity, created_at
    
    POST /prompts/
    Creates new prompt and returns it or validation errors
    """
    
    if request.method == 'GET':
        # Get all prompts
        prompts = Prompt.objects.all()
        data = [
            {
                'id': p.id,
                'title': p.title,
                'complexity': p.complexity,
                'created_at': p.created_at.isoformat()
            }
            for p in prompts
        ]
        return JsonResponse({'status': 'success', 'data': data}, status=200)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse(
                {'status': 'error', 'message': 'Invalid JSON'},
                status=400
            )
        
        # Validate input
        is_valid, errors = validate_prompt_data(data)
        if not is_valid:
            return JsonResponse(
                {'status': 'error', 'errors': errors},
                status=400
            )
        
        # Create prompt
        try:
            prompt = Prompt.objects.create(
                title=data['title'].strip(),
                content=data['content'].strip(),
                complexity=int(data['complexity'])
            )
            
            return JsonResponse(
                {
                    'status': 'success',
                    'data': {
                        'id': prompt.id,
                        'title': prompt.title,
                        'content': prompt.content,
                        'complexity': prompt.complexity,
                        'created_at': prompt.created_at.isoformat()
                    }
                },
                status=201
            )
        except Exception as e:
            return JsonResponse(
                {'status': 'error', 'message': str(e)},
                status=500
            )


@require_http_methods(["GET"])
def prompt_detail(request, prompt_id):
    """
    Get prompt details and increment view counter in Redis.
    
    GET /prompts/<id>/
    Returns full prompt with id, title, content, complexity, created_at, view_count
    """
    
    try:
        prompt = Prompt.objects.get(id=prompt_id)
    except Prompt.DoesNotExist:
        return JsonResponse(
            {'status': 'error', 'message': 'Prompt not found'},
            status=404
        )
    
    # Increment view counter in Redis
    redis_conn = get_redis_client()
    view_count = 0
    
    if redis_conn:
        try:
            view_key = f'prompt:{prompt_id}:views'
            view_count = redis_conn.incr(view_key)
        except Exception as e:
            print(f'Redis error: {str(e)}')
    else:
        print('Redis connection failed, continuing without view counter')
    
    # Return prompt details
    return JsonResponse(
        {
            'status': 'success',
            'data': {
                'id': prompt.id,
                'title': prompt.title,
                'content': prompt.content,
                'complexity': prompt.complexity,
                'created_at': prompt.created_at.isoformat(),
                'view_count': view_count
            }
        },
        status=200
    )


@require_http_methods(["OPTIONS"])
@csrf_exempt
def cors_preflight(request):
    """
    Handle CORS preflight requests.
    """
    response = JsonResponse({'status': 'ok'})
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    return response
