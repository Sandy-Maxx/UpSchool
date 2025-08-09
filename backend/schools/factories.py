"""
Factory classes for schools models.
"""
import factory
from factory.django import DjangoModelFactory

from .models import School, AcademicYear, Class, Subject
from accounts.factories import TenantFactory


class SchoolFactory(DjangoModelFactory):
    """Factory for School model."""
    
    class Meta:
        model = School
    
    name = factory.Sequence(lambda n: f"Test School {n}")
    tenant = factory.SubFactory(TenantFactory)


class AcademicYearFactory(DjangoModelFactory):
    """Factory for Academic Year model."""
    
    class Meta:
        model = AcademicYear
    
    school = factory.SubFactory(SchoolFactory)
    start_date = factory.Faker('date_this_year')
    end_date = factory.Faker('date_this_year')


class ClassFactory(DjangoModelFactory):
    """Factory for Class model."""
    
    class Meta:
        model = Class
    
    name = factory.Sequence(lambda n: f"Class {n}")
    school = factory.SubFactory(SchoolFactory)
    academic_year = factory.SubFactory(AcademicYearFactory)


class SubjectFactory(DjangoModelFactory):
    """Factory for Subject model."""
    
    class Meta:
        model = Subject
    
    name = factory.Sequence(lambda n: f"Subject {n}")
    code = factory.Sequence(lambda n: f"SUBJ{n}")
    school = factory.SubFactory(SchoolFactory)
