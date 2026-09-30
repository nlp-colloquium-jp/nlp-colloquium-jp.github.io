document.addEventListener('DOMContentLoaded', function () {
  function normalizeOffsetIso(isoString) {
    if (!isoString) return '';
    return isoString.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  }

  function formatDateInTimezone(date, timezone) {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(date);

    var map = {};
    parts.forEach(function (part) {
      map[part.type] = part.value;
    });

    return map.year + map.month + map.day + 'T' + map.hour + map.minute + map.second;
  }

  function escapeIcsText(value) {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\r\n|\r|\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function formatUtcStamp(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  }

  var containers = document.querySelectorAll('.calendar-actions');
  var dropdowns = document.querySelectorAll('.calendar-dropdown');

  function closeAllDropdowns() {
    dropdowns.forEach(function (dropdown) {
      dropdown.removeAttribute('open');
    });
  }

  dropdowns.forEach(function (dropdown) {
    dropdown.addEventListener('toggle', function () {
      if (!dropdown.open) {
        return;
      }

      dropdowns.forEach(function (other) {
        if (other !== dropdown) {
          other.removeAttribute('open');
        }
      });
    });
  });

  document.addEventListener('click', function (event) {
    if (event.target.closest('.calendar-dropdown')) {
      return;
    }
    closeAllDropdowns();
  });

  containers.forEach(function (container) {
    var title = container.dataset.title;
    var startIso = normalizeOffsetIso(container.dataset.startIso || '');
    var endIso = normalizeOffsetIso(container.dataset.endIso || '');
    var timezone = container.dataset.timezone || 'Asia/Tokyo';
    var description = container.dataset.description || '';
    var fallbackUidBase = startIso ? startIso.replace(/[^0-9]/g, '').slice(0, 14) : 'event';
    var uid = container.dataset.uid || (fallbackUidBase + '-nlp-colloquium');
    var url = container.dataset.url || '';

    var startDate = startIso ? new Date(startIso) : null;
    if (!startDate || Number.isNaN(startDate.getTime())) {
      return;
    }

    var endDate = null;
    if (endIso) {
      endDate = new Date(endIso);
    }
    if (!endDate || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    }

    var start = formatDateInTimezone(startDate, timezone);
    var end = formatDateInTimezone(endDate, timezone);

    var googleLink = container.querySelector('[data-calendar-google]');
    if (googleLink) {
      var params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: start + '/' + end,
        ctz: timezone,
        details: description
      });
      googleLink.href = 'https://calendar.google.com/calendar/render?' + params.toString();
    }

    var icsLink = container.querySelector('[data-calendar-ics]');
    if (icsLink) {
      var lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//NLP Colloquium JP//Schedule//JA',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-TIMEZONE:' + timezone,
        'BEGIN:VEVENT',
        'UID:' + uid + '@nlp-colloquium-jp',
        'DTSTAMP:' + formatUtcStamp(new Date()),
        'DTSTART;TZID=' + timezone + ':' + start,
        'DTEND;TZID=' + timezone + ':' + end,
        'SUMMARY:' + escapeIcsText(title),
        'DESCRIPTION:' + escapeIcsText(description)
      ];

      if (url) {
        lines.push('URL:' + escapeIcsText(url));
      }

      lines.push('END:VEVENT', 'END:VCALENDAR');

      var icsBody = lines.join('\r\n');
      icsLink.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsBody);
      icsLink.download = uid + '.ics';
    }
  });
});
