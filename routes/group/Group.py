from fastapi import Depends, APIRouter, HTTPException, status
import config.database as database
import uuid
from routes.group.models import (Create_group,Stored_group)
from routes.user.models import (User)
from routes.auth import (Token,oauth2)
import datetime

router = APIRouter(tags=["Groups"], prefix="/group")

@router.post('/create',status_code=201)
def create_group(info:Create_group,current_user: User = Depends(oauth2.get_current_user)):
    try:
        cursor = database.user_col.find_one({"email":info.admin.email})
        if cursor:
            group_id = str(uuid.uuid4())
            new_array = cursor['created_groups']
            group_info = Stored_group(
                subject=info.subject,
                amount=info.amount,
                created_on=str(datetime.date.today()),
                group_id=group_id,
                admin=dict(info.admin),
                participants=info.participants
            )
            new_array.insert(0,dict(group_info))
            cursor2 = database.user_col.find_one_and_update({'email':info.admin.email},{'$set':{'created_groups':new_array}})

            if not cursor2:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            for part in info.participants:
                cursor = database.user_col.find_one({"email":part.email})
                new_array = cursor['invited_groups']
                new_array.insert(0,dict(group_info))
                cursor2 = database.user_col.find_one_and_update({'email':part.email},{'$set':{'invited_groups':new_array}})
            
            cursor=database.groups.insert_one(dict(group_info))

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)