from sqlalchemy import String, Integer, ForeignKey, Date, Float, Text, Enum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
import enum
from typing import List

db_url = "postgresql+asyncpg://user:password@localhost:5433/main"


class Base(DeclarativeBase):
    pass

class TransportEnum(enum.Enum):
    plane = "Plane"
    bus = "Bus"
    train = "Train"
    ship = "Ship"

class EmployeePositionEnum(enum.Enum):
    moderator = "moderator"
    admin = "admin"

class Client(Base):
    __tablename__ = "clients"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True)
    phone: Mapped[str] = mapped_column(String)

    bookings: Mapped[List["Booking"]] = relationship(back_populates="client")

class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    position: Mapped[EmployeePositionEnum] = mapped_column(Enum(EmployeePositionEnum))

    bookings: Mapped[List["Booking"]] = relationship(back_populates="employee")

class Country(Base):
    __tablename__ = "countries"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)

    cities: Mapped[List["City"]] = relationship(back_populates="country")

class City(Base):
    __tablename__ = "cities"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    country_id: Mapped[int] = mapped_column(ForeignKey("countries.id"))

    country: Mapped["Country"] = relationship(back_populates="cities")
    hotels: Mapped[List["Hotel"]] = relationship(back_populates="city")

class Hotel(Base):
    __tablename__ = "hotels"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    stars: Mapped[int] = mapped_column(Integer)
    city_id: Mapped[int] = mapped_column(ForeignKey("cities.id"))

    city: Mapped["City"] = relationship(back_populates="hotels")
    tours: Mapped[List["Tour"]] = relationship(back_populates="hotel")

class TourType(Base):
    __tablename__ = "tour_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)

    tours: Mapped[List["Tour"]] = relationship(back_populates="tour_type")

class Tour(Base):
    __tablename__ = "tours"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text)
    tour_type_id: Mapped[int] = mapped_column(ForeignKey("tour_types.id"))
    hotel_id: Mapped[int] = mapped_column(ForeignKey("hotels.id"))
    transport: Mapped[TransportEnum] = mapped_column(Enum(TransportEnum))
    base_price: Mapped[float] = mapped_column(Float)

    tour_type: Mapped["TourType"] = relationship(back_populates="tours")
    hotel: Mapped["Hotel"] = relationship(back_populates="tours")
    dates: Mapped[List["TourDate"]] = relationship(back_populates="tour")
    bookings: Mapped[List["Booking"]] = relationship(back_populates="tour")

class TourDate(Base):
    __tablename__ = "tour_dates"

    id: Mapped[int] = mapped_column(primary_key=True)
    tour_id: Mapped[int] = mapped_column(ForeignKey("tours.id"))
    start_date: Mapped[Date] = mapped_column(Date)
    end_date: Mapped[Date] = mapped_column(Date)

    tour: Mapped["Tour"] = relationship(back_populates="dates")
    bookings: Mapped[List["Booking"]] = relationship(back_populates="tour_date")

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_id: Mapped[int] = mapped_column(ForeignKey("clients.id"))
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id"))
    tour_id: Mapped[int] = mapped_column(ForeignKey("tours.id"))
    tour_date_id: Mapped[int] = mapped_column(ForeignKey("tour_dates.id"))
    booking_date: Mapped[Date] = mapped_column(Date)
    total_price: Mapped[float] = mapped_column(Float)

    client: Mapped["Client"] = relationship(back_populates="bookings")
    employee: Mapped["Employee"] = relationship(back_populates="bookings")
    tour: Mapped["Tour"] = relationship(back_populates="bookings")
    tour_date: Mapped["TourDate"] = relationship(back_populates="bookings")
    payments: Mapped[List["Payment"]] = relationship(back_populates="booking")
    reviews: Mapped[List["Review"]] = relationship(back_populates="booking")

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True)
    booking_id: Mapped[int] = mapped_column(ForeignKey("bookings.id"))
    amount: Mapped[float] = mapped_column(Float)
    payment_date: Mapped[Date] = mapped_column(Date)
    method: Mapped[str] = mapped_column(String)

    booking: Mapped["Booking"] = relationship(back_populates="payments")

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    booking_id: Mapped[int] = mapped_column(ForeignKey("bookings.id"))
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(Text)

    booking: Mapped["Booking"] = relationship(back_populates="reviews")
