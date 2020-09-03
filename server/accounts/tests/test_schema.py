from server.schema import schema
from accounts.factories import UserFactory, ProfileFactory
import pytest
from graphene.test import Client
from faker import Faker

fake = Faker()


@pytest.mark.django_db
def test_me_query_1(snapshot, request):
    """ Test a me query without profile"""

    user = UserFactory(latitude=0, longitude=0)
    request.user = user
    client = Client(schema, context=request)

    executed = client.execute('''
          query me {
    me {
      categories {
        id
        name
        posts {
          id
        }
      }
      id
      geoLocationAllowed
      email
      isVerified
      lastVerificationCode
      fullName
      gallery {
        id
        image
      }
      profiles {
        id
        name
        avatar {
          id
          image
          source {
            id
            image
          }
        }
        age
        gender
        isActive
        user {
          id
          fullName
          email
        }
      }
    }
  }
    ''', variables={})

    snapshot.assert_match(executed)


@pytest.mark.django_db
def test_me_query_2(snapshot, request):
    """ Test a me query with profile"""

    user = UserFactory()
    ProfileFactory(user=user)

    request.user = user
    client = Client(schema, context=request)

    executed = client.execute('''
          query me {
    me {
      categories {
        id
        name
        posts {
          id
        }
      }
      id
      geoLocationAllowed
      email
      isVerified
      lastVerificationCode
      fullName
      gallery {
        id
        image
      }
      profiles {
        id
        name
        avatar {
          id
          image
          source {
            id
            image
          }
        }
        age
        gender
        isActive
        user {
          id
          fullName
          email
        }
      }
    }
  }
    ''', variables={})

    snapshot.assert_match(executed)
