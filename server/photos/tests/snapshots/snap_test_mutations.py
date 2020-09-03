# -*- coding: utf-8 -*-
# snapshottest: v1 - https://goo.gl/zC4yUc
from __future__ import unicode_literals

from snapshottest import Snapshot


snapshots = Snapshot()

snapshots['test_add_to_gallery_mutation_1 1'] = {
    'data': {
        'addToGallery': {
            'image': {
                'deleted': False,
                'id': '52',
                'image': 'server/media/gallery/example_pic.jpg',
                'user': {
                    'email': 'email52@gmail.com',
                    'id': '74'
                }
            }
        }
    }
}

snapshots['test_set_avatar_mutation_1 1'] = {
    'data': {
        'setAvatar': {
            'errors': [
            ],
            'success': True
        }
    }
}
