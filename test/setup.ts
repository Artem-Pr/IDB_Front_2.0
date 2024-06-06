import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs';

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(customParseFormat)