from fastapi import Depends, APIRouter, HTTPException, status
import config.database as database
import uuid
from routes.group.models import (Create_group,Stored_group,Req_user_add,User_Info_Group)
from routes.user.models import (User)
from routes.auth import (Token,oauth2)
import mailer.group_creation as grp_cre
import datetime

router = APIRouter(tags=["Groups"], prefix="/group")

@router.post('/create',status_code=201)
def create_group(info:Create_group,current_user: User = Depends(oauth2.get_current_user)):
    try:
        # checking if the admin exists in the usercollection
        cursor = database.user_col.find_one({"email":info.admin.email})

        if cursor:
            # creating a group
            print("inside")
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
            
            participants_email=[]

            # updating the participants invited group in user collection
            for part in info.participants:
                if(part.email == info.admin.email):
                    continue
                cursor = database.user_col.find_one({"email":part.email})
                participants_email.append(part.email)
                new_array = cursor['invited_groups']
                new_array.insert(0,dict(group_info))
                cursor2 = database.user_col.find_one_and_update({'email':part.email},{'$set':{'invited_groups':new_array}})
            
            # updating the group creators user collection created groups
            if(len(participants_email)>0):
                cursor2 = database.user_col.find_one_and_update({'email':info.admin.email},{'$set':{'created_groups':new_array}})
                if not cursor2:
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            else:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            cursor=database.groups.insert_one(dict(group_info))
            participants_email.append(info.admin.email)
            grp_cre.email("added",info.admin.email,participants_email,info.subject)
        
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@router.delete('/{group_id}',status_code=202)
def delete_group(group_id:str,current_user: User = Depends(oauth2.get_current_user)):

    try:
        # removing the group from the group collection
        cursor = database.groups.find_one({'group_id':group_id})
        if(cursor['admin']['email']!=current_user.email):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        cursor1 = database.groups.delete_one({'group_id':group_id})

        #removing the group from the user obj of admin    
        cursor2 = database.user_col.find_one({'email':cursor['admin']['email']})
        prev_arr = cursor2['created_groups']
        for i in range(0,len(prev_arr)):
            if(prev_arr[i]['group_id']==group_id):
                prev_arr.pop(i)
        cursor2 = database.user_col.find_one_and_update({'email':cursor2['email']},{'$set':{'created_groups':prev_arr}})

        # removing the group from the user obj of the participants   
        for part in cursor['participants']:
            cursor = database.user_col.find_one({"email":part['email']})
            new_array = cursor['invited_groups']
            for i in range(0,len(new_array)):
                if(new_array[i]['group_id']==group_id):
                    new_array.pop(i)
            cursor2 = database.user_col.find_one_and_update({'email':part['email']},{'$set':{'invited_groups':new_array}})
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@router.post('/add',status_code=202)
def add_user(req:Req_user_add,current_user: User = Depends(oauth2.get_current_user)):

    try:

        cursor = database.groups.find_one({'group_id':req.group_id})
        if(cursor['admin']['email']!=current_user.email):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        part_arr = cursor['participants']
        for p in part_arr:
            if(p['email']==req.email):
                raise HTTPException(status_code=status.HTTP_409_CONFLICT)
            p['amount'] = float((cursor['amount']*1.0)/(len(part_arr)+1))

        cursor1 = database.user_col.find_one({'email':req.email})

        # updating the participant invited group array
        if(cursor1):
            part_arr.append(dict(User_Info_Group(
                user_id=cursor1['user_id'],
                email = cursor1['email'],
                amount = float((cursor['amount']*1.0)/(len(part_arr)+1))
            )))

            group_info = Stored_group(
                subject=cursor['subject'],
                amount=cursor['amount'],
                created_on=cursor['created_on'],
                group_id=cursor['group_id'],
                admin=cursor['admin'],
                participants=part_arr
            )
            new_array = cursor1['invited_groups']
            new_array.insert(0,dict(group_info))
            cursor2 = database.user_col.find_one_and_update({'email':req.email},{'$set':{'invited_groups':new_array}})

            cursor2 = database.groups.find_one_and_update({'group_id':req.group_id},{'$set':{'participants':part_arr}})

            grp_cre.email("added",current_user.email,[req.email],cursor['subject'])

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@router.post('/remove',status_code=202)
def remove_user(req:Req_user_add,current_user: User = Depends(oauth2.get_current_user)):
    try:
        # checking if admin is removing
        cursor = database.groups.find_one({'group_id':req.group_id})
        if(cursor['admin']['email']!=current_user.email):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        part_arr = cursor['participants']

        # removing those participants from group info
        for p in range(0,len(part_arr)):
            if(part_arr[p]['email'] in req.email):
                part_arr.pop(p)
                flag = False
                continue
            part_arr[p]['amount'] = float((cursor['amount']*1.0)/(len(part_arr)-1))
        
        # editing peoples participating
        for people in part_arr:
            cursor_people = database.user_col.find_one({'email':people['email']})
            invited_grps = cursor_people['invited_groups']
            for grp in range(0,len(invited_grps)):
                if(invited_grps[grp]['group_id']==req.group_id):
                    invited_grps[grp]['participants'] = part_arr
            cursor_people = database.user_col.find_one_and_update({'email':people['email']},{'$set':{'invited_groups':invited_grps}})
        
        # for admin
        cursor_admin = database.user_col.find_one({'email':cursor['admin']['email']})
        created_grps = cursor_admin['created_groups']
        for grp in range(0,len(created_grps)):
            if(created_grps[grp]['group_id']==req.group_id):
                created_grps[grp]['participants'] = part_arr
        cursor_admin = database.user_col.find_one_and_update({'email':cursor['admin']['email']},{'$set':{'created_groups':created_grps}})
        

        # removing from the removed participants
        for mails in req.email:
            cursor1 = database.user_col.find_one({'email':mails})
            # updating the participant invited group array
            if(cursor1):
                invited_arr = cursor1['invited_groups']
                for grps in range(0,invited_arr):
                    if(invited_arr[grps]['group_id']==req.group_id):
                        invited_arr.pop(grps)

                cursor2 = database.user_col.find_one_and_update({'email':mails},{'$set':{'invited_groups':invited_arr}})
                if not cursor2 : 
                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        cursor3 = database.groups.find_one_and_update({'group_id':req.group_id},{'$set':{'participants':part_arr}})
            
        if not cursor3:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

        grp_cre.email("removed",current_user.email,req.email,cursor['subject'])

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

