# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['test_me_query_1 1'] = {
    'data': {
        'me': {
            'categories': [
            ],
            'email': 'email50@gmail.com',
            'fullName': 'John50 Smith',
            'gallery': [
            ],
            'geoLocationAllowed': True,
            'id': '72',
            'isVerified': True,
            'lastVerificationCode': '',
            'profiles': [
            ]
        }
    }
}

snapshots['test_me_query_2 1'] = {
    'data': {
        'me': {
            'categories': [
            ],
            'email': 'email51@gmail.com',
            'fullName': 'John51 Smith',
            'gallery': [
            ],
            'geoLocationAllowed': True,
            'id': '73',
            'isVerified': True,
            'lastVerificationCode': '',
            'profiles': [
                {
                    'age': 21,
                    'avatar': None,
                    'gender': 'MALE',
                    'id': '56',
                    'isActive': True,
                    'name': 'John50 Profile',
                    'user': {
                        'email': 'email51@gmail.com',
                        'fullName': 'John51 Smith',
                        'id': '73'
                    }
                }
            ]
        }
    }
}
