# Answers to Analytics and DB Task.

## User Analytics
[Task Source](https://github.com/AkwasiSB/frontend-challenge/blob/master/README.md/#what-is-the-challenge)

The user analytics for this particalur app will mostly be captured from the Home page as that is where there is much content for user interaction. Below are the type of users behaviour that needs to be captured for analytics purposes.

- Events tracking - This type of tracking includes the use of the search input, filters and buttons clicks by the users.
<br>
For tracking the search input we can understand how the search functionality is used and then know if there needs to be improvement in the search results.
<br>
For the filters tracking, we can also get to know for example the type of news source or topic users are looking for more so we can provide meaningful content to a particular user context.
<br>
For button click tracking (especially the Read button), this will help in providing rich content to the site users to cater for their reading needs

- Session tracking - Tracking the amount of time spent on the site is also good to help determine how useful the content on the site can be improved to help in user retention.

- Navigation tracking - This tracking helps to know the navigation pattern of a user on the site and the page which users spend more time on. For this simple app in terms of functionality, I think it is not really needed but it is a good thing to do if more pages are to be added later.

With all these tracking of user interactions on the site, we need to take into consideration the users privacy when collecting these data.

<br>
<br>
<br>
<br>
<br>

## DB Evaluation Task
[Task Source](https://github.com/AkwasiSB/frontend-challenge/blob/master/DB-Task.md)

**1. As per the above provided requirements, define the minimal database structure which can satisfy the requirements. No queries are required, and what required tables and fields required?**
```
Member {
  id (primary, auto-generated),
  name (non-null),
  email (unique, non-null),
  is_authed (default=true),
  cc_number (unique, indexed, non-null)],
  notification_id (indexed)
}
```

```
Event {
  id (primary, auto-generated),
  title (non-null),
  date (non-null),
  location (non-null),
  cost (non-null),
  registration_count (indexed, default=0),
  is_cancelled (indexed, default=false),
  organiser (non-null)
}
```

```
MembersEvent {
  id (primary),
  member_id (foreign_key),
  event_id (foreign_key),
  amount_paid (non-null),
  full_payment (default=false)
}
```

<br>
<br>

**2. Define what steps required for event registration (i.e. database flow). Suppose you are already logged in and on registration page with option to select event from dropdown list, member information is available globally.**

- Get member id, credit card number from the global member information and event id and cost from the event dropdown list. Send event registration data to server:

```sh
registrationData {
  member_id: 1,
  event_id: 5,
  full_payment: false,
  cost: 50
}
```

- Request for the amount to be deducted from members credit card. Based upon the registration data `(i.e  cost: 50, full_payment: false)` **25** will be deducted initially because partial payment is allowed:

```sh
Select from Member table => cc_number as creditCard => where id: 1

if [creditCard have enough funds && is not expired]
  Payment processor deduct the amount 25.

  Create a record in MembersEvent table with the data received.

  MembersEvent {
    id: (auto-generated),
    member_id: 1,
    event_id: 5,
    amount_paid: 25
  }
else
  Error is returned about failed registration due to insufficient funds or credit card expiration.

  Stopped processing further.
```
- After record is succesfully created, registration count for the event with id 5 in the Event table should be increased:

```sh
Select from Event table => registration_count as counter => where event_id: 5

Update Event table => set registration_count: counter + 1 => where id: 5
```
- On record succesfully updated, success is returned on the registration completion

<br>
<br>

**3. Describe the database flow for cancellation and/or refund?**

- Event is cancelled by the organiser and data is send to the server:

```sh
cancelledData {
  event_id: 5,
  is_cancelled: true
}
```

- Update MembersEvent table records with the data provided from the cancelledData received:

```sh
Update Event table => set is_cancelled: true => where id: 5
```

- Get all members for the cancelled event and used the returned data to get notification_id and cc_number for each registered members:

```sh
Select from MembersEvent table => member_id as member, amount_paid => where event_id: 5

Select from Member table => notification_id, cc_number => where member_id: member
```

- Refund the amount paid back to cancelled event members credit cards.
And if notificatio_id is not null send user notification about the cancelled event and the refund.
