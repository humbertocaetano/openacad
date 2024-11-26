async function createAllocation(req, res) {
  const { teacherId, subjectId, year, schedule } = req.body;
  
  try {
    // Verificar conflitos de horário
    const conflicts = await checkTimeConflicts(teacherId, schedule);
    if (conflicts.length > 0) {
      return res.status(400).json({
        error: 'Conflito de horário detectado',
        conflicts
      });
    }

    // Criar alocação
    const allocation = await db.transaction(async (trx) => {
      const [teacherSubject] = await trx('teacher_subjects')
        .insert({
          teacher_id: teacherId,
          subject_id: subjectId,
          year,
          active: true
        })
        .returning('*');

      const scheduleRecords = schedule.map(slot => ({
        teacher_subject_id: teacherSubject.id,
        weekday: slot.weekday,
        start_time: slot.startTime,
        end_time: slot.endTime
      }));

      await trx('class_schedules').insert(scheduleRecords);

      return teacherSubject;
    });

    res.status(201).json(allocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function checkTimeConflicts(teacherId, schedule) {
  const conflicts = await db('class_schedules as cs')
    .join('teacher_subjects as ts', 'cs.teacher_subject_id', 'ts.id')
    .where('ts.teacher_id', teacherId)
    .whereIn('cs.weekday', schedule.map(s => s.weekday))
    .andWhere(function() {
      this.whereBetween('cs.start_time', [schedule.startTime, schedule.endTime])
        .orWhereBetween('cs.end_time', [schedule.startTime, schedule.endTime]);
    })
    .select('cs.*', 'ts.subject_id');

  return conflicts;
}
