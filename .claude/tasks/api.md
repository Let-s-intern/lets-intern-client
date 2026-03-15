GET
/api/v2/admin/challenge/{challengeId}/mentor
챌린지 멘토 목록 조회

Parameters
Try it out
Name Description
challengeId \*
integer($int64)
(path)
challengeId
Responses
Code Description Links
200
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"mentorList": [
{
"challengeMentorId": 0,
"userId": 0,
"name": "string",
"userCareerList": [
{
"id": 0,
"company": "string",
"field": "string",
"job": "string",
"position": "string",
"department": "string",
"employmentType": "string",
"startDate": {
"year": 0,
"month": "JANUARY",
"monthValue": 0,
"leapYear": true
},
"endDate": {
"year": 0,
"month": "JANUARY",
"monthValue": 0,
"leapYear": true
},
"isAddedByAdmin": true
}
]
}
]
}
No links
404
Media type

application/json
Examples

엔티티를 찾을 수 없습니다.
Example Value
{
"status": 404,
"message": "엔티티를 찾을 수 없습니다."
}

GET
/api/v1/program/admin
[어드민] 프로그램 통합 조회

Parameters
Try it out
Name Description
type
array[string]
(query)
Available values : CHALLENGE, LIVE, VOD, REPORT, GUIDEBOOK

--CHALLENGELIVEVODREPORTGUIDEBOOK
classification
array[string]
(query)
Available values : CAREER_SEARCH, DOCUMENT_PREPARATION, MEETING_PREPARATION, PASS

--CAREER_SEARCHDOCUMENT_PREPARATIONMEETING_PREPARATIONPASS
status
array[string]
(query)
Available values : PREV, PROCEEDING, POST

--PREVPROCEEDINGPOST
startDate
string($date-time)
(query)
startDate
endDate
string($date-time)
(query)
endDate
isActive
boolean
(query)

--
pageable \*
object
(query)
{
"page": 0,
"size": 1,
"sort": [
"string"
]
}
Responses
Code Description Links
200
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"programInfo": {
"id": 0,
"programType": "CHALLENGE",
"programStatusType": "PREV",
"title": "string",
"thumbnail": "string",
"currentCount": 0,
"participationCount": 0,
"zoomLink": "string",
"zoomPassword": "string",
"isVisible": true,
"startDate": "2026-03-15T19:01:45.110Z",
"endDate": "2026-03-15T19:01:45.110Z",
"beginning": "2026-03-15T19:01:45.110Z",
"deadline": "2026-03-15T19:01:45.110Z",
"createdAt": "2026-03-15T19:01:45.110Z"
},
"classificationList": {},
"adminClassificationList": {}
}

POST
/api/v2/admin/challenge/{challengeId}/mentor/{challengeMentorId}/match
챌린지 멘토 멘티 매칭

Parameters
Try it out
Name Description
challengeId _
integer($int64)
(path)
challengeId
challengeMentorId _
integer($int64)
(path)
challengeMentorId
Request body

application/json
Example Value
Schema
{
"challengeApplicationIdList": [
0
]
}
Responses
Code Description Links
200
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"status": 0,
"message": "string",
"data": {}
}
No links
404
Media type

application/json
Examples

엔티티를 찾을 수 없습니다.
Example Value
{
"status": 404,
"message": "엔티티를 찾을 수 없습니다."
}
No links
GET
/api/v1/challenge/{challengeId}/applications
[어드민] 프로그램 신청자 조회

Parameters
Try it out
Name Description
challengeId \*
integer($int64)
(path)
challengeId
isCanceled
boolean
(query)

--
isMentee
boolean
(query)

--
Responses
Code Description Links
200
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"applicationList": [
{
"application": {
"id": 0,
"paymentId": 0,
"name": "string",
"email": "string",
"phoneNum": "string",
"university": "string",
"grade": "FIRST",
"major": "string",
"couponName": "string",
"couponDiscount": 0,
"finalPrice": 0,
"programPrice": 0,
"programDiscount": 0,
"refundPrice": 0,
"orderId": "string",
"isCanceled": true,
"wishJob": "string",
"wishCompany": "string",
"inflowPath": "string",
"createDate": "2026-03-15T19:03:27.761Z",
"accountType": "KB",
"accountNum": "string",
"challengePricePlanType": "LIGHT",
"originalPrice": 0,
"challengeMentorId": 0,
"challengeMentorName": "string"
},
"optionPriceSum": 0,
"optionDiscountPriceSum": 0
}
]
}

GET
/api/v1/challenge/{challengeId}/mission/{missionId}/feedback/attendances/mentee
[멘토용] 챌린지 피드백 미션별 나의 멘티 제출 내역 조회

Parameters
Try it out
Name Description
challengeId _
integer($int64)
(path)
challengeId
missionId _
integer($int64)
(path)
missionId
Responses
Code Description Links
200
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"attendanceList": [
{
"id": 0,
"userId": 0,
"challengeMentorId": 0,
"mentorName": "string",
"name": "string",
"major": "string",
"wishJob": "string",
"wishCompany": "string",
"link": "string",
"status": "PRESENT",
"result": "WAITING",
"challengePricePlanType": "LIGHT",
"feedbackStatus": "WAITING",
"optionCode": "string"
}
]
}
No links
404
Media type

application/json
Examples

존재하지 않는 신청 내역입니다.
Example Value
{
"status": 404,
"message": "존재하지 않는 신청 내역입니다."
}

GET
/api/v1/challenge/mentor/feedback-management
[멘토용] 참여중인 챌린지별 피드백 미션 제출/피드백 현황 조회

Parameters
Try it out
No parameters

Responses
Code Description Links
200
OK

Media type

application/json
Controls Accept header.
Example Value
Schema
{
"challengeList": [
{
"challengeId": 0,
"title": "string",
"shortDesc": "string",
"startDate": "2026-03-15T19:04:53.126Z",
"endDate": "2026-03-15T19:04:53.126Z",
"feedbackMissions": [
{
"missionId": 0,
"missionTitle": "string",
"th": 0,
"submittedCount": 0,
"notSubmittedCount": 0,
"feedbackStatusCounts": [
{
"feedbackStatus": "WAITING",
"count": 0
}
]
}
]
}
]
}

• 챌린지 멘토 목록 조회
GET /api/v2/admin/challenge/{challengeId}/mentor
멘토 userCareer 목록 추가

• 어드민 프로그램 조회
GET /api/v1/program/admin
isActive 파라미터 추가
진행중인 챌린지 조회 시 isActive=true로 조회

• 신규 챌린지 멘토 멘티 매칭
POST /api/v2/admin/challenge/{challengeId}/mentor/{challengeMentorId}/match/{applicationId} → /api/v2/admin/challenge/{challengeId}/mentor/{challengeMentorId}/match (다건 한번에 등록 가능하게 수정)

• 신규 [어드민] 프로그램 신청자 조회
GET /api/v1/challenge/{challengeId}/applications
isMentee 파라미터 추가
멘티 목록 조회 시 isCanceled=false&isMentee=true로 조회

• 신규 [멘토용] 챌린지 피드백 미션별 나의 멘티 제출 내역 조회
GET /api/v1/challenge/{challengeId}/mission/{missionId}/feedback/attendances/mentee
미제출자는 id를 null로 반환

• 신규 [멘토용] 참여중인 챌린지별 피드백 미션 제출/피드백 현황 조회
GET /api/v1/challenge/mentor/feedback-management
