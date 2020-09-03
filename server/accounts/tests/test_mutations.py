from unittest.mock import patch

import pytest
from faker import Faker
from graphene.test import Client
from graphql_jwt.shortcuts import get_token
from django.core import mail

from accounts.models import User, Profile
from server.schema import schema

faker = Faker()


@pytest.mark.django_db
def test_register_mutation_1(snapshot):
    """ Test a success register mutation"""

    email = faker.email()
    user_password = '123qweasdzxc123'
    client = Client(schema)

    executed = client.execute('''
          mutation register($userInput: UserInput!) {
    register(userInput: $userInput) {
      errors
      success
      token
      user {
        id
        fullName
        email
        lastVerificationCode
        isVerified
        profiles {
        id
        user {
          id
          email
        }
      }
      }
    }
  }
    ''', variables={'userInput': {'email': email, 'password1': user_password, 'password2': user_password}})

    assert executed['data']['register']['user']['email'] == email
    assert executed['data']['register']['user']['lastVerificationCode']
    assert not executed['data']['register']['user']['isVerified']
    assert executed['data']['register']['success']


@pytest.mark.django_db
def test_register_mutation_2(snapshot):
    """ Test a unsuccess register mutation with incorrect email """

    email = faker.word()
    user_password = 'qweqweqwe'
    client = Client(schema)

    executed = client.execute('''
    mutation register($userInput: UserInput!) {
    register(userInput: $userInput) {
      errors
      success
      token
      user {
        id
        fullName
        email
        lastVerificationCode
        isVerified
        profiles {
        id
        user {
          id
          email
        }
      }
      }
    }
  }
    ''', variables={"userInput": {'email': email, 'password1': user_password, 'password2': user_password}})
    assert not executed['data']['register']['success']


@pytest.mark.django_db
def test_register_mutation_3(snapshot):
    """ Test a unsuccess register mutation for passwords didn't match """

    email = faker.email()
    password1 = 'qweqweqwe'
    password2 = 'asdasdasd'
    client = Client(schema)

    executed = client.execute('''
    mutation register($userInput: UserInput!) {
    register(userInput: $userInput) {
      errors
      success
      token
      user {
        id
        fullName
        email
        lastVerificationCode
        isVerified
        profiles {
        id
        user {
          id
          email
        }
      }
      }
    }
  }
    ''', variables={"userInput": {'email': email, 'password1': password1, 'password2': password2}})
    assert not executed['data']['register']['success']
    assert executed['data']['register']['errors'][0] == "Passwords didn't match."


@pytest.mark.django_db
def test_register_mutation_4(snapshot):
    """ Test a unsuccess register mutation for email already taken """

    email = faker.email()
    User.objects.create(email=email)
    password = 'qweqweqwe'
    client = Client(schema)

    executed = client.execute('''
    mutation register($userInput: UserInput!) {
    register(userInput: $userInput) {
      errors
      success
      token
      user {
        id
        fullName
        email
        lastVerificationCode
        isVerified
        profiles {
        id
        user {
          id
          email
        }
      }
      }
    }
  }
    ''', variables={"userInput": {'email': email, 'password1': password, 'password2': password}})
    assert not executed['data']['register']['success']
    assert executed['data']['register']['errors'][0] == "User with specified email already exists."


@pytest.mark.django_db
def test_login_mutation_1(snapshot):
    """ Test successful login mutation """
    password = 'qweqweqwe'
    user = User.objects.create(email=faker.email())
    user.set_password(password)
    user.save()
    client = Client(schema)

    executed = client.execute('''
    mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      errors
      success
      token
      user {
        id
		fullName
		email
		lastVerificationCode
		isVerified
		profiles {
			id
			user {
			id
			email
			}
		}
      }
    }
  }
    ''', variables={'email': user.email, 'password': password})

    assert executed['data']['login']['success']
    assert executed['data']['login']['token']
    assert int(executed['data']['login']['user']['id']) == user.id


@pytest.mark.django_db
def test_login_mutation_2(snapshot):
    """ Test unsuccessful login mutation """

    password = 'qweqweqwe'
    user = User.objects.create(email=faker.email())
    user.set_password(password)
    user.save()
    client = Client(schema)

    executed = client.execute('''
    mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      errors
      success
      token
      user {
        id
		fullName
		email
		lastVerificationCode
		isVerified
		profiles {
			id
			user {
			id
			email
			}
		}
      }
    }
  }
    ''', variables={'email': faker.email(), 'password': password})

    assert not executed['data']['login']['success']
    assert not executed['data']['login']['token']
    assert not executed['data']['login']['user']
    assert executed['data']['login']['errors']


@pytest.mark.django_db
def test_login_mutation_3(snapshot):
    """ Test unsuccessful login mutation """

    password = 'qweqweqwe'
    user = User.objects.create(email=faker.email())
    user.set_password(password)
    user.save()
    client = Client(schema)

    executed = client.execute('''
    mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      errors
      success
      token
      user {
        id
		fullName
		email
		lastVerificationCode
		isVerified
		profiles {
			id
			user {
			id
			email
			}
		}
      }
    }
  }
    ''', variables={'email': user.email, 'password': faker.word()})

    assert not executed['data']['login']['success']
    assert not executed['data']['login']['token']
    assert not executed['data']['login']['user']
    assert executed['data']['login']['errors']


@pytest.mark.django_db
def test_verify_user_mutation_1(snapshot, request):
    """ Test successful verify user mutation """

    verification_code = "1111"
    user = User.objects.create(
        email=faker.email(), last_verification_code=verification_code)

    token = get_token(user)
    request.headers = dict()
    request.headers['AUTHORIZATION'] = "Bearer {token}".format(
        token=token)
    client = Client(schema, context=request)

    executed = client.execute('''
    mutation verifyUser($code: String!) {
    verifyUser(code: $code) {
			errors
			success
			user{
				id
				isVerified
			}
    	}
  	}
    ''', variables={'code': verification_code})

    assert executed['data']['verifyUser']['success']
    assert not executed['data']['verifyUser']['errors']
    assert executed['data']['verifyUser']['user']['id'] == str(user.id)
    assert executed['data']['verifyUser']['user']['isVerified']


@pytest.mark.django_db
def test_verify_user_mutation_2(snapshot, request):
    """ Test unsuccessful verify user mutation with wrong code """

    verification_code = "1111"
    user = User.objects.create(
        email=faker.email(), last_verification_code=verification_code)

    token = get_token(user)
    request.headers = dict()
    request.headers['AUTHORIZATION'] = "Bearer {token}".format(
        token=token)
    client = Client(schema, context=request)

    executed = client.execute('''
    mutation verifyUser($code: String!) {
    verifyUser(code: $code) {
			errors
			success
			user{
				id
				isVerified
			}
    	}
  	}
    ''', variables={'code': 2222})

    assert not executed['data']['verifyUser']['success']
    assert executed['data']['verifyUser']['errors'][0] == 'Code is incorrect.'
    assert not executed['data']['verifyUser']['user']


@pytest.mark.django_db
def test_verify_user_mutation_3(snapshot, request):
    """ Test unsuccessful verify user mutation with incorrect token """

    verification_code = "1111"
    User.objects.create(
        email=faker.email(), last_verification_code=verification_code)

    request.headers = dict()
    request.headers['AUTHORIZATION'] = "Bearer {token}".format(
        token='lorem ipsum')
    client = Client(schema, context=request)

    executed = client.execute('''
    mutation verifyUser($code: String!) {
    verifyUser(code: $code) {
			errors
			success
			user{
				id
				isVerified
			}
    	}
  	}
    ''', variables={'code': verification_code})

    assert not executed['data']['verifyUser']['success']
    assert executed['data']['verifyUser']['errors'][0] == "Auth token isn't valid."
    assert not executed['data']['verifyUser']['user']


@pytest.mark.django_db
def test_verify_user_mutation_4(snapshot, request):
    """ Test unsuccessful verify user mutation with empty header """

    verification_code = "1111"
    User.objects.create(
        email=faker.email(), last_verification_code=verification_code)

    request.headers = dict()
    client = Client(schema, context=request)

    executed = client.execute('''
    mutation verifyUser($code: String!) {
    verifyUser(code: $code) {
			errors
			success
			user{
				id
				isVerified
			}
    	}
  	}
    ''', variables={'code': verification_code})

    assert not executed['data']['verifyUser']['success']
    assert executed['data']['verifyUser']['errors'][0] == "Auth token isn't valid."
    assert not executed['data']['verifyUser']['user']


@pytest.mark.django_db
def test_resend_verification_code_mutation_1(snapshot, request):
    """ Test successful resend verification code mutation """

    user = User.objects.create(
        email=faker.email())

    request.user = user
    client = Client(schema, context=request)

    executed = client.execute('''
    mutation resendVerificationCode {
    resendVerificationCode {
        errors
        success
      }
    }
    ''', variables=dict())

    assert executed['data']['resendVerificationCode']['success']
    assert not executed['data']['resendVerificationCode']['errors']
    assert len(mail.outbox) == 1


@pytest.mark.django_db
def test_send_forgot_password_mutation_1(snapshot, request):
    """ Test successful send forgot password mutation """

    verification_code = "1111"
    user = User.objects.create(
        email=faker.email(), last_verification_code=verification_code)

    request.user = user
    client = Client(schema, context=request)

    executed = client.execute('''
    mutation sendForgotPassword($email: String!) {
    sendForgotPassword(email: $email) {
        errors
        success
      }
    }
    ''', variables={"email": user.email})

    assert executed['data']['sendForgotPassword']['success']
    assert not executed['data']['sendForgotPassword']['errors']
    assert User.objects.get(
        email=user.email).last_verification_code != verification_code
    assert len(mail.outbox) == 1


@pytest.mark.django_db
def test_send_forgot_password_mutation_2(snapshot):
    """ Test unsuccessful send forgot password mutation with not existing email """

    email = faker.email()

    client = Client(schema)

    executed = client.execute('''
    mutation sendForgotPassword($email: String!) {
    sendForgotPassword(email: $email) {
        errors
        success
      }
    }
    ''', variables={"email": email})

    assert not executed['data']['sendForgotPassword']['success']
    assert executed['data']['sendForgotPassword']['errors'][0] == 'User with specified email does not exists.'
    assert len(mail.outbox) == 0


@pytest.mark.django_db
def test_verify_forgot_password_mutation_1(snapshot):
    """ Test successful send verify forgot password mutation """

    email = faker.email()
    verification_code = "1111"
    User.objects.create(
        email=email, last_verification_code=verification_code)

    client = Client(schema)

    executed = client.execute('''
    mutation verifyForgotPassword($email: String!, $code: String!) {
    verifyForgotPassword(email: $email, code: $code) {
        errors
        success
        token
      }
    }
    ''', variables={"email": email, "code": verification_code})

    assert executed['data']['verifyForgotPassword']['success']
    assert executed['data']['verifyForgotPassword']['token']
    assert not executed['data']['verifyForgotPassword']['errors']


@pytest.mark.django_db
def test_verify_forgot_password_mutation_2(snapshot):
    """ Test unsuccessful send verify forgot password mutation with not existing email """

    email = faker.email()
    incorrect_email = "wrong@wrong.com"
    verification_code = "1111"
    User.objects.create(
        email=email, last_verification_code=verification_code)

    client = Client(schema)

    executed = client.execute('''
    mutation verifyForgotPassword($email: String!, $code: String!) {
    verifyForgotPassword(email: $email, code: $code) {
        errors
        success
        token
      }
    }
    ''', variables={"email": incorrect_email, "code": verification_code})

    assert not executed['data']['verifyForgotPassword']['success']
    assert not executed['data']['verifyForgotPassword']['token']
    assert executed['data']['verifyForgotPassword']['errors'][0] == "User with specified email does not exists."


@pytest.mark.django_db
def test_verify_forgot_password_mutation_3(snapshot):
    """ Test unsuccessful send verify forgot password mutation with not existing email """

    email = faker.email()
    incorrect_code = "2222"
    verification_code = "1111"
    User.objects.create(
        email=email, last_verification_code=verification_code)

    client = Client(schema)

    executed = client.execute('''
    mutation verifyForgotPassword($email: String!, $code: String!) {
    verifyForgotPassword(email: $email, code: $code) {
        errors
        success
        token
      }
    }
    ''', variables={"email": email, "code": incorrect_code})

    assert not executed['data']['verifyForgotPassword']['success']
    assert executed['data']['verifyForgotPassword']['errors'][0] == "Code is incorrect"
    assert not executed['data']['verifyForgotPassword']['token']


@pytest.mark.django_db
def test_change_password_mutation_1(snapshot, request):
    """ Test successful change password mutation """

    email = faker.email()
    password = 'qweqweqwe'
    new_password = "asdasdasd"
    user = User.objects.create(
        email=email)
    user.set_password(password)
    user.save()
    request.user = user

    client = Client(schema, context=request)

    executed = client.execute('''
    mutation changePassword($password1: String!, $password2: String!) {
    changePassword(password1: $password1, password2: $password2) {
      success
      errors
    }
  }
    ''', variables={"password1": new_password, "password2": new_password})

    user = User.objects.get(email=email)
    assert executed['data']['changePassword']['success']
    assert not executed['data']['changePassword']['errors']
    assert user.check_password(new_password)


@pytest.mark.django_db
def test_change_password_mutation_2(snapshot, request):
    """ Test unsuccessful change password mutation when password didn't match """

    email = faker.email()
    password = 'qweqweqwe'
    new_password = "asdasdasd"
    user = User.objects.create(
        email=email)
    user.set_password(password)
    user.save()
    request.user = user

    client = Client(schema, context=request)

    executed = client.execute('''
    mutation changePassword($password1: String!, $password2: String!) {
    changePassword(password1: $password1, password2: $password2) {
      success
      errors
    }
  }
    ''', variables={"password1": new_password, "password2": password})

    user = User.objects.get(email=email)
    assert not executed['data']['changePassword']['success']
    assert executed['data']['changePassword']['errors'][0] == "Passwords didn't match."
    assert user.check_password(password)


@pytest.mark.django_db
def test_contact_us_mutation_1(snapshot):
    """ Test successful contact us mutation """

    email = faker.email()
    User.objects.create(
        email=email)

    client = Client(schema)

    executed = client.execute('''
    mutation contactUs($senderEmail: String!, $message: String!) {
    contactUs(senderEmail: $senderEmail, message: $message) {
      success
      errors
    }
  }
    ''', variables={"senderEmail": email, "message": "lorem ipsum"})

    assert executed['data']['contactUs']['success']
    assert not executed['data']['contactUs']['errors']
    assert len(mail.outbox) == 1


@pytest.mark.django_db
def test_contact_us_mutation_2(snapshot):
    """ Test unsuccessful contact us mutation with incorrect email format """

    email = "emailemail.com"

    client = Client(schema)

    executed = client.execute('''
    mutation contactUs($senderEmail: String!, $message: String!) {
    contactUs(senderEmail: $senderEmail, message: $message) {
      success
      errors
    }
  }
    ''', variables={"senderEmail": email, "message": "lorem ipsum"})

    assert not executed['data']['contactUs']['success']
    assert executed['data']['contactUs']['errors'][0] == "Incorrect email."
    assert len(mail.outbox) == 0


@pytest.mark.django_db
def test_create_profile_mutation_1(snapshot, request):
    """ Test successful create profile mutation """

    user = User.objects.create(email=faker.email())
    request.user = user

    data = {"name": faker.name(), "education": faker.word(), "job": faker.word(),
            "description": faker.text()[:200], "age": 18, "gender": "Male"}

    client = Client(schema, context=request)

    executed = client.execute('''
    mutation createProfile($profileInput: ProfileInput!) {
    createProfile(profileInput: $profileInput) {
      errors
      success
      profile {
        id
        name
        education
        job
        description
        age
        gender
        user {
          id
        }
      }
    }
  }
    ''', variables={"profileInput": data})

    assert executed['data']['createProfile']['success']
    assert not executed['data']['createProfile']['errors']
    assert executed['data']['createProfile']['profile']['name'] == data['name']
    assert executed['data']['createProfile']['profile']['education'] == data['education']
    assert executed['data']['createProfile']['profile']['job'] == data['job']
    assert executed['data']['createProfile']['profile']['description'] == data['description']
    assert executed['data']['createProfile']['profile']['age'] == data['age']
    assert executed['data']['createProfile']['profile']['gender'].lower(
    ) == data['gender'].lower()


@pytest.mark.django_db
def test_create_profile_mutation_2(snapshot, request):
    """ Test unsuccessful create profile mutation with max of profiles """

    user = User.objects.create(email=faker.email())
    request.user = user

    data = {"name": faker.name(), "education": faker.word(), "job": faker.word(),
            "description": faker.text()[:200], "age": 18, "gender": "Male"}
    for i in range(0, 3):
        Profile.objects.create(user=user, **data)

    client = Client(schema, context=request)
    executed = client.execute('''
    mutation createProfile($profileInput: ProfileInput!) {
    createProfile(profileInput: $profileInput) {
      errors
      success
      profile {
        id
        name
        education
        job
        description
        age
        gender
        user {
          id
        }
      }
    }
  }
    ''', variables={"profileInput": data})

    assert not executed['data']['createProfile']['success']
    assert executed['data']['createProfile']['errors']
    assert not executed['data']['createProfile']['profile']


@pytest.mark.django_db
def test_set_active_profile_mutation_1(snapshot, request):
    """ Test successful set active profile mutation """

    user = User.objects.create(email=faker.email())
    request.user = user

    data = {"name": faker.name(), "education": faker.word(), "job": faker.word(),
            "description": faker.text()[:200], "age": 18, "gender": "Male"}
    profile = Profile.objects.create(user=user, is_active=False, **data)

    client = Client(schema, context=request)
    executed = client.execute('''
      mutation setActiveProfile($profileId: ID!) {
      setActiveProfile(profileId: $profileId) {
        success
        errors
      }
    }
    ''', variables={"profileId": profile.id})
    profile = Profile.objects.get(id=profile.id)

    assert profile.is_active
    assert executed['data']['setActiveProfile']['success']
    assert not executed['data']['setActiveProfile']['errors']


@pytest.mark.django_db
def test_allow_geolocation_mutation_1(snapshot, request):
    """ Test successful allow geolocation mutation """

    user = User.objects.create(email=faker.email(), geo_location_allowed=False)
    request.user = user
    latitude = '1'
    longitude = '2'

    client = Client(schema, context=request)
    fake_db_for_tester_patch = patch('server.utils.fake_db_for_tester')

    with fake_db_for_tester_patch as mock_fake_db:
        executed = client.execute('''
			mutation allowGeoLocation(
				$isAllowed: Boolean!
				$latitude: String!
				$longitude: String!
			) {
				allowGeoLocation(
				isAllowed: $isAllowed
				latitude: $latitude
				longitude: $longitude
				) {
				errors
				success
				}
			}
		''', variables={"isAllowed": True, "latitude": latitude, "longitude": longitude})

        user = User.objects.get(id=user.id)
        assert user.geo_location_allowed
        assert user.latitude == latitude
        assert user.longitude == longitude
        assert executed['data']['allowGeoLocation']['success']
        assert not executed['data']['allowGeoLocation']['errors']
