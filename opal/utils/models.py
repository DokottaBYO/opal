"""
OPAL model utils
"""

from django.contrib.contenttypes import generic
from django.db import models

from opal.utils.fields import ForeignKeyOrFreeText

class LookupList(models.Model):
    class Meta:
        abstract = True


def lookup_list(name, module=__name__):
    """
    Given the name of a lookup list, return the tuple of class_name, bases, attrs
    for the user to define the class
    """
    prefix = 'Lookup List: '
    class_name = name.capitalize() # TODO handle camelcase properly
    bases = (LookupList,)
    attrs = {
        'name': models.CharField(max_length=255, unique=True),
        'synonyms': generic.GenericRelation('opal.Synonym'),
        'Meta': type('Meta', (object,), {'ordering': ['name'], 
                                         'verbose_name': prefix+name}),
        '__unicode__': lambda self: self.name,
        '__module__': module,
    }
    return class_name, bases, attrs
    
 
def episode_subrecords():
    """
    Generator function for episode subrecords.
    """
    # CircularImport - SELF is used as a manager by models in this module
    from opal.models import EpisodeSubrecord
    for model in EpisodeSubrecord.__subclasses__():
        if model._meta.abstract:
            continue
        yield model

def patient_subrecords():
    """
    Generator function for patient subrecords.
    """
    # CircularImport - SELF is used as a manager by models in this module
    from opal.models import PatientSubrecord
    for model in PatientSubrecord.__subclasses__():
        if model._meta.abstract:
            continue
        yield model

def subrecords():
    """
    Generator function for subrecords
    """
    for m in episode_subrecords():
        yield m
    for m in patient_subrecords():
        yield m
    
# These are models for testing.
# TODO move these to tests directory so they are not made available when app is
# added to INSTALLED_APPS.


class Colour(models.Model):
    name = models.CharField(max_length=255)

class Person(models.Model):
    favorite_colour = ForeignKeyOrFreeText(Colour)
