import { DateTime, Interval } from 'luxon'
export function useDatetime() {

  const getProjectTimeRangeString = (item:any) => {
    if (item !== null) {
      const startTime = DateTime.fromISO(item.start_time, { locale: 'de-DE' })
      const endTime = DateTime.fromISO(item.end_time, { locale: 'de-DE' })
      const timeRange = Interval.fromDateTimes(startTime, endTime)
      return timeRange.toFormat('MMMM yyyy')
    }
  }

  const getProjectTimeRangeRatingString = (item:any) => {
    if (item !== null) {
      const ratingStartTime = DateTime.fromISO(item.rating_start, { locale: 'de-DE' })
      const ratingEndTime = DateTime.fromISO(item.rating_end, { locale: 'de-DE' })
      const ratingTimeRange = Interval.fromDateTimes(ratingStartTime, ratingEndTime)
      return ratingTimeRange.toFormat('MMMM yyyy')
    }
  }

  const getProjectTimeEndString = (item:any) => {
    if (item !== null) {
      const endTime = DateTime.fromISO(item.end_time, { locale: 'de-DE' })
      return endTime.toFormat('dd.MM.yyyy')
    }
  }

  const getProjectTimeEndRatingString = (item:any) => {
    if (item !== null) {
      const endTime = DateTime.fromISO(item.rating_end, { locale: 'de-DE' })
      return endTime.toFormat('dd.MM.yyyy')
    }
  }

  const parseDatetime = (item:any) => {
    const datetime = DateTime.fromISO(item, { locale: 'de-DE' })
    return datetime.toFormat('dd.MM.yyyy')
  }

  const parseDateAndTime = (item:any) => {
    const datetime = DateTime.fromISO(item, { locale: 'de-DE' });
    return datetime.toFormat('dd.MM.yyyy HH:mm');
  };


  const isInPast = (item:any) => {
    const today = DateTime.now()
    const compareableTime = DateTime.fromISO(item, { locale: 'de-DE' })
    return compareableTime <= today
  }

  const timeTillEnd = (timestamp:string) => {
    const today = DateTime.now()
    const ratingEnd = DateTime.fromISO(timestamp, { locale: 'de-DE' })
    const compareableTimeRating = ratingEnd.diff(today, 'days').toFormat('dd')

    return compareableTimeRating
  }

  const getToday = () => {
    const today = DateTime.now().toFormat('dd.MM.yyyy')
      return today
  }

  return {
    getProjectTimeRangeString,
    parseDatetime,
    parseDateAndTime,
    isInPast,
    timeTillEnd,
    getProjectTimeEndString,
    getProjectTimeRangeRatingString,
    getProjectTimeEndRatingString,
    getToday
  }
}
