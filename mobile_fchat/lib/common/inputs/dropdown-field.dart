import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../helpers/utils.dart';
import 'models/android-dropdown-model.dart';
import 'models/ios-dropdown-model.dart';

class DropDownField extends StatefulWidget{
  dynamic value;
  int padding;
  double borderRadius;
  Color borderColor;
  TextStyle? textStyle;
  List<Widget> items;
  List<Widget> selectedItems;
  void Function(dynamic) onChanged;

  bool isRequired;
  bool isImbriqued;
  String hint;


  DropDownField({
    super.key,
    this.isRequired = true,
    this.isImbriqued = false,
    this.borderRadius = 5,
    this.padding = 10,
    this.borderColor = const Color.fromRGBO(220, 220, 220, 1),
    this.textStyle,
    this.value,
    required this.onChanged,
    required this.items,
    required this.hint,
    required this.selectedItems,
  });

  @override
  DropDownFieldState createState() => DropDownFieldState();
}

class DropDownFieldState extends State<DropDownField>{

  String prefixText = "";

  @override
  void initState() {
    super.initState();
    prefixText = (widget.isRequired) ? ' *' : '';
  }

  @override
  Widget build(BuildContext context) {
    var dropdown = Utils.isAndroid(context) ? AndroidDropdownModel(
      borderRadius: widget.borderRadius,
      borderColor: widget.borderColor,
      onChanged: widget.onChanged,
      items: widget.items,
      selectedItems: widget.selectedItems,
      context: context,
    ) :
      InkWell(
      child: Container(
        padding: const EdgeInsets.all(12),
        width: 80,
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(5),
            border: Border.all(color: Colors.transparent)
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            //widget.selectedItems[widget.value ?? 0],
            Text(widget.value.toString()),
            const Text("widget.value.toString()"),
            (widget.isImbriqued) ?
            Container(
              height: 20,
              width: 5,
              decoration: const BoxDecoration(
                  color: Colors.black26
              ),
            ) : const Icon(Icons.arrow_drop_down_sharp)
          ],
        ),
      ),
      onTap: (){
        showCupertinoModalPopup<void>(
          context: context,
          builder: (BuildContext context) => Container(
              height: 200,
              padding: const EdgeInsets.only(top: 6.0),
              margin: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: iOSDropdownModel(
                  items: widget.items.map((item){
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: item,
                    );
                  }).toList(),
                  onSelectedItemChanged: widget.onChanged
              )
          ),
        );
      },
    );

    if(widget.isImbriqued){
      return dropdown;
    }
    else{
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.hint + prefixText,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 8,),
          Utils.isAndroid(context) ?
          AndroidDropdownModel(
            borderRadius: widget.borderRadius,
            borderColor: widget.borderColor,
            onChanged: widget.onChanged,
            items: widget.items,
            selectedItems: widget.selectedItems,
            context: context,
          ) :
          InkWell(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(5),
                  border: Border.all(color: Colors.black26)
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  widget.selectedItems[widget.value ?? 0],
                  const Icon(Icons.arrow_drop_down_sharp)
                ],
              ),
            ),
            onTap: (){
              showCupertinoModalPopup<void>(
                context: context,
                builder: (BuildContext context) => Container(
                    height: 200,
                    padding: const EdgeInsets.only(top: 6.0),
                    margin: EdgeInsets.only(
                      bottom: MediaQuery.of(context).viewInsets.bottom,
                    ),
                    child: iOSDropdownModel(
                        items: widget.items,
                        onSelectedItemChanged: widget.onChanged
                    )
                ),
              );
            },
          ),
          const SizedBox(height: 7,),
        ],
      );
    }
  }
}