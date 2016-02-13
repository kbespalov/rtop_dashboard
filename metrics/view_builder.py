import collections


def build_view(instances_metric):
    view = {}
    for instance_name, metric in instances_metric.iteritems():
        view[instance_name] = {}
        for data in metric:
            system_stat = data['system']
            procs_stat = data['procs']
            summary_cpu_ticks = sum(list(system_stat.cpu))
            view[instance_name][data['timestamp']] = {
                'ram': [system_stat.mem.total // 1024,
                        system_stat.mem.free // 1024,
                        (system_stat.mem.total - system_stat.mem.free) // 1024],
                'cpu': [round(system_stat.cpu.user * 100.0 / summary_cpu_ticks, 1),
                        round(system_stat.cpu.system * 100.0 / summary_cpu_ticks, 1),
                        round(system_stat.cpu.idle * 100.0 / summary_cpu_ticks, 1)],
                'disk': [system_stat.disk.total,
                         system_stat.disk.free,
                         system_stat.disk.used],
                'psnap': [[stat.pid,
                           stat.name[1:-1],
                           stat.status,
                           stat.uid,
                           stat.resident_mem,
                           round(stat.resident_mem * 100.0 / system_stat.mem.total, 2),
                           round(stat.used_ticks * 100.0 / summary_cpu_ticks, 2),
                           round(stat.wait_ticks * 100.0 / stat.used_ticks, 2) if stat.used_ticks else 0,
                           stat.threads,
                           round(stat.wbytes / (1024.0 * 1024), 1),
                           round(stat.rbytes / (1024.0 * 1024), 1)
                           ] for pid, stat in procs_stat.iteritems() if stat.used_ticks > 0]
            }
            view[instance_name] = collections.OrderedDict(sorted(view[instance_name].items()))
    return view
