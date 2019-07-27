from django.conf import settings

db = settings.FIRESTORE

def delete_collection(coll_ref, batch_size=5):
    docs = coll_ref.limit(batch_size).get()
    deleted = 0

    for doc in docs:
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)